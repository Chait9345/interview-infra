from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    Boolean,
    ForeignKey,
)
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func

from db.base import Base


class InterviewAnswerAttempt(Base):
    """
    One row = one answer attempt.
    Immutable.
    """
    __tablename__ = "interview_answer_attempt"

    attempt_id = Column(String, primary_key=True)
    turn_id = Column(String, ForeignKey("interview_question_turn.turn_id"), nullable=False)

    attempt_index = Column(Integer, nullable=False)
    answer_payload = Column(JSONB, nullable=False)

    is_final = Column(Boolean, nullable=False, default=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
