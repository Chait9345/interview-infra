from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.sessions import InterviewSession, InterviewSessionStatus
from backend.orchestrator_adapter import (
    run_interview_orchestrator,
    OrchestratorExecutionError,
)

# IMPORTANT:
# Replace with your real DB dependency
from backend.database import get_db

router = APIRouter(prefix="/interviews", tags=["interviews"])


@router.post("/start")
def start_interview_session(
    role_config: str,
    question_graph: str,
    db: Session = Depends(get_db),
):
    session = InterviewSession(
        role_config=role_config,
        question_graph=question_graph,
        status=InterviewSessionStatus.RUNNING,
        started_at=datetime.utcnow(),
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    try:
        evaluation = run_interview_orchestrator()

        session.status = InterviewSessionStatus.COMPLETED
        session.completed_at = datetime.utcnow()
        session.evaluation = evaluation

    except OrchestratorExecutionError as e:
        session.status = InterviewSessionStatus.FAILED
        session.error_message = str(e)

    db.commit()
    db.refresh(session)

    if session.status == InterviewSessionStatus.FAILED:
        raise HTTPException(status_code=500, detail=session.error_message)

    return {
        "session_id": str(session.id),
        "status": session.status,
        "evaluation": session.evaluation,
    }
