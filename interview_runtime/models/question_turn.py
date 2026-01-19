from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.sql import func

from db.base import Base


class InterviewQuestionTurn(Base):
    """
    One row = one question presentation.
    Append-only.
    """
    __tablename__ = "interview_question_turn"

    turn_id = Column(String, primary_key=True)
    session_id = Column(String, ForeignKey("interview_session_runtime.session_id"), nullable=False)

    node_id = Column(String, nullable=False)
    turn_index = Column(Integer, nullable=False)

    presented_at = Column(DateTime(timezone=True), server_default=func.now())
    closed_at = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint("session_id", "turn_index", name="uq_session_turn_index"),
    )
