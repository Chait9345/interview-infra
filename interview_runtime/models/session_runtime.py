from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.sql import func

from db.base import Base  # adjust import if needed


class InterviewSessionRuntime(Base):
    """
    Additive runtime state for interview execution.
    One-to-one with InterviewSession (same session_id).
    """
    __tablename__ = "interview_session_runtime"

    session_id = Column(String, primary_key=True)

    # Runtime-controlled state
    state = Column(String, nullable=False)  # CREATED, RUNNING, PAUSED, COMPLETED, FAILED
    current_node_id = Column(String, nullable=True)

    # Determinism & safety
    orchestrator_graph_version = Column(String, nullable=False)
    runtime_version = Column(Integer, nullable=False, default=0)

    state_updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
