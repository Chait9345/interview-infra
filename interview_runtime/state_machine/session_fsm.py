from enum import Enum
from typing import Optional


class SessionState(str, Enum):
    CREATED = "CREATED"
    RUNNING = "RUNNING"
    PAUSED = "PAUSED"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class InvalidTransitionError(Exception):
    pass


class SessionStateMachine:
    """
    Pure deterministic state machine for interview sessions.
    No side effects. No persistence. No orchestrator calls.
    """

    # Explicit transition map
    _ALLOWED_TRANSITIONS = {
        SessionState.CREATED: {SessionState.RUNNING},
        SessionState.RUNNING: {
            SessionState.PAUSED,
            SessionState.COMPLETED,
            SessionState.FAILED,
        },
        SessionState.PAUSED: {
            SessionState.RUNNING,
            SessionState.FAILED,
        },
        SessionState.COMPLETED: set(),
        SessionState.FAILED: set(),
    }

    @classmethod
    def validate_transition(
        cls,
        from_state: SessionState,
        to_state: SessionState,
    ) -> None:
        allowed = cls._ALLOWED_TRANSITIONS.get(from_state, set())
        if to_state not in allowed:
            raise InvalidTransitionError(
                f"Illegal session transition: {from_state} → {to_state}"
            )

    @classmethod
    def transition(
        cls,
        from_state: SessionState,
        to_state: SessionState,
    ) -> SessionState:
        """
        Validate and return next state.
        """
        cls.validate_transition(from_state, to_state)
        return to_state

    @staticmethod
    def is_terminal(state: SessionState) -> bool:
        return state in {SessionState.COMPLETED, SessionState.FAILED}

    @staticmethod
    def can_accept_answers(state: SessionState) -> bool:
        return state == SessionState.RUNNING

    @staticmethod
    def can_pause(state: SessionState) -> bool:
        return state == SessionState.RUNNING

    @staticmethod
    def can_resume(state: SessionState) -> bool:
        return state == SessionState.PAUSED
