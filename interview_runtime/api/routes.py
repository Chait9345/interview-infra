from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from interview_runtime.engine import InterviewRuntimeEngine
from interview_runtime.models import InterviewSessionRuntime
from interview_runtime.state_machine import SessionState
from db.session import get_db  # adjust if needed
from orchestrator.adapter import get_orchestrator_adapter  # existing adapter

router = APIRouter(prefix="/interview-runtime", tags=["Interview Runtime"])


def get_runtime_engine(
    db: Session = Depends(get_db),
):
    orchestrator = get_orchestrator_adapter()
    return InterviewRuntimeEngine(db=db, orchestrator_adapter=orchestrator)


@router.post("/sessions/{session_id}/start")
def start_session(
    session_id: str,
    db: Session = Depends(get_db),
    engine: InterviewRuntimeEngine = Depends(get_runtime_engine),
):
    session = db.query(InterviewSessionRuntime).get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    start_node_id = engine.orchestrator.start_node_id()

    engine.start_session(
        session=session,
        start_node_id=start_node_id,
    )

    return {"status": "started", "session_id": session_id}


@router.get("/sessions/{session_id}/current-question")
def get_current_question(
    session_id: str,
    db: Session = Depends(get_db),
):
    session = db.query(InterviewSessionRuntime).get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    if session.state != SessionState.RUNNING.value:
        raise HTTPException(status_code=400, detail="Session not running")

    # Question content comes directly from orchestrator
    question = get_orchestrator_adapter().get_node(
        session.current_node_id
    )

    return {
        "node_id": session.current_node_id,
        "question": question,
    }


@router.post("/sessions/{session_id}/answer")
def submit_answer(
    session_id: str,
    payload: dict,
    is_final: bool,
    expected_runtime_version: int,
    db: Session = Depends(get_db),
    engine: InterviewRuntimeEngine = Depends(get_runtime_engine),
):
    session = db.query(InterviewSessionRuntime).get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    engine.submit_answer(
        session=session,
        answer_payload=payload,
        is_final=is_final,
        expected_runtime_version=expected_runtime_version,
    )

    return {
        "status": "answer_recorded",
        "session_state": session.state,
        "runtime_version": session.runtime_version,
    }


@router.post("/sessions/{session_id}/pause")
def pause_session(
    session_id: str,
    expected_runtime_version: int,
    db: Session = Depends(get_db),
    engine: InterviewRuntimeEngine = Depends(get_runtime_engine),
):
    session = db.query(InterviewSessionRuntime).get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    engine.pause_session(
        session=session,
        expected_runtime_version=expected_runtime_version,
    )

    return {
        "status": "paused",
        "runtime_version": session.runtime_version,
    }


@router.post("/sessions/{session_id}/resume")
def resume_session(
    session_id: str,
    expected_runtime_version: int,
    db: Session = Depends(get_db),
    engine: InterviewRuntimeEngine = Depends(get_runtime_engine),
):
    session = db.query(InterviewSessionRuntime).get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    engine.resume_session(
        session=session,
        expected_runtime_version=expected_runtime_version,
    )

    return {
        "status": "resumed",
        "runtime_version": session.runtime_version,
    }
