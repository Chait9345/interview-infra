from uuid import uuid4
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

from interview_runtime.models import (
    InterviewSessionRuntime,
    InterviewQuestionTurn,
    InterviewAnswerAttempt,
)
from interview_runtime.state_machine import (
    SessionState,
    SessionStateMachine,
    InvalidTransitionError,
)


class RuntimeInvariantError(Exception):
    pass


class InterviewRuntimeEngine:
    """
    Transactional runtime engine.
    One instance per DB session.
    """

    def __init__(self, db: Session, orchestrator_adapter):
        self.db = db
        self.orchestrator = orchestrator_adapter

    # -----------------------------
    # Internal helpers
    # -----------------------------

    def _fail_session(self, session: InterviewSessionRuntime, reason: str):
        session.state = SessionState.FAILED.value
        self.db.add(session)
        self.db.commit()
        raise RuntimeInvariantError(reason)

    def _assert_version(self, session: InterviewSessionRuntime, expected_version: int):
        if session.runtime_version != expected_version:
            raise RuntimeInvariantError(
                "Concurrent modification detected for session"
            )

    def _increment_version(self, session: InterviewSessionRuntime):
        session.runtime_version += 1

    # -----------------------------
    # Public runtime operations
    # -----------------------------

    def start_session(
        self,
        session: InterviewSessionRuntime,
        start_node_id: str,
    ):
        try:
            SessionStateMachine.transition(
                SessionState(session.state),
                SessionState.RUNNING,
            )

            session.state = SessionState.RUNNING.value
            session.current_node_id = start_node_id

            turn = InterviewQuestionTurn(
                turn_id=str(uuid4()),
                session_id=session.session_id,
                node_id=start_node_id,
                turn_index=0,
            )

            self._increment_version(session)

            self.db.add(turn)
            self.db.add(session)
            self.db.commit()

        except (InvalidTransitionError, SQLAlchemyError) as e:
            self.db.rollback()
            self._fail_session(session, str(e))

    def submit_answer(
        self,
        session: InterviewSessionRuntime,
        answer_payload: dict,
        is_final: bool,
        expected_runtime_version: int,
    ):
        try:
            self._assert_version(session, expected_runtime_version)

            if not SessionStateMachine.can_accept_answers(SessionState(session.state)):
                raise RuntimeInvariantError("Session not accepting answers")

            # Fetch current open turn
            turn = (
                self.db.query(InterviewQuestionTurn)
                .filter(
                    InterviewQuestionTurn.session_id == session.session_id,
                    InterviewQuestionTurn.closed_at.is_(None),
                )
                .one_or_none()
            )

            if not turn:
                raise RuntimeInvariantError("No open question turn")

            # Determine attempt index
            attempt_count = (
                self.db.query(InterviewAnswerAttempt)
                .filter(InterviewAnswerAttempt.turn_id == turn.turn_id)
                .count()
            )

            attempt = InterviewAnswerAttempt(
                attempt_id=str(uuid4()),
                turn_id=turn.turn_id,
                attempt_index=attempt_count,
                answer_payload=answer_payload,
                is_final=is_final,
            )

            self.db.add(attempt)

            # If not final, no transition
            if not is_final:
                self.db.commit()
                return

            # Close turn
            turn.closed_at = self.db.func.now()

            # Ask orchestrator for next node
            next_node_id = self.orchestrator.next_node(
                current_node_id=session.current_node_id
            )

            if next_node_id is None:
                # End of interview
                SessionStateMachine.transition(
                    SessionState(session.state),
                    SessionState.COMPLETED,
                )
                session.state = SessionState.COMPLETED.value
                session.current_node_id = None
            else:
                # Advance to next node
                new_turn = InterviewQuestionTurn(
                    turn_id=str(uuid4()),
                    session_id=session.session_id,
                    node_id=next_node_id,
                    turn_index=turn.turn_index + 1,
                )
                session.current_node_id = next_node_id
                self.db.add(new_turn)

            self._increment_version(session)

            self.db.add(turn)
            self.db.add(session)
            self.db.commit()

        except (InvalidTransitionError, RuntimeInvariantError, SQLAlchemyError) as e:
            self.db.rollback()
            self._fail_session(session, str(e))

    def pause_session(
        self,
        session: InterviewSessionRuntime,
        expected_runtime_version: int,
    ):
        try:
            self._assert_version(session, expected_runtime_version)

            SessionStateMachine.transition(
                SessionState(session.state),
                SessionState.PAUSED,
            )

            # Ensure no open question
            open_turn = (
                self.db.query(InterviewQuestionTurn)
                .filter(
                    InterviewQuestionTurn.session_id == session.session_id,
                    InterviewQuestionTurn.closed_at.is_(None),
                )
                .one_or_none()
            )

            if open_turn:
                raise RuntimeInvariantError(
                    "Cannot pause with an open question turn"
                )

            session.state = SessionState.PAUSED.value
            self._increment_version(session)

            self.db.add(session)
            self.db.commit()

        except (InvalidTransitionError, RuntimeInvariantError, SQLAlchemyError) as e:
            self.db.rollback()
            self._fail_session(session, str(e))

    def resume_session(
        self,
        session: InterviewSessionRuntime,
        expected_runtime_version: int,
    ):
        try:
            self._assert_version(session, expected_runtime_version)

            SessionStateMachine.transition(
                SessionState(session.state),
                SessionState.RUNNING,
            )

            # Ensure there is no open turn
            open_turn = (
                self.db.query(InterviewQuestionTurn)
                .filter(
                    InterviewQuestionTurn.session_id == session.session_id,
                    InterviewQuestionTurn.closed_at.is_(None),
                )
                .one_or_none()
            )

            if open_turn:
                raise RuntimeInvariantError("Open turn exists on resume")

            if not session.current_node_id:
                raise RuntimeInvariantError("No current node to resume")

            # Create new turn for the current node
            last_turn = (
                self.db.query(InterviewQuestionTurn)
                .filter(InterviewQuestionTurn.session_id == session.session_id)
                .order_by(InterviewQuestionTurn.turn_index.desc())
                .first()
            )

            next_index = 0 if not last_turn else last_turn.turn_index + 1

            turn = InterviewQuestionTurn(
                turn_id=str(uuid4()),
                session_id=session.session_id,
                node_id=session.current_node_id,
                turn_index=next_index,
            )

            session.state = SessionState.RUNNING.value
            self._increment_version(session)

            self.db.add(turn)
            self.db.add(session)
            self.db.commit()

        except (InvalidTransitionError, RuntimeInvariantError, SQLAlchemyError) as e:
            self.db.rollback()
            self._fail_session(session, str(e))
