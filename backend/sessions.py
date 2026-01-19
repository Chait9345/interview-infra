from datetime import datetime
from enum import Enum
from uuid import uuid4

from sqlalchemy import Column, String, DateTime, Enum as SAEnum, JSON
from sqlalchemy.dialects.postgresql import UUID

# IMPORTANT:
# You MUST replace this import with your actual Base
# Example:
# from backend.database import Base
from backend.database import Base


class InterviewSessionStatus(str, Enum):
    CREATED = "CREATED"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class InterviewSession(Base):
    __tablename__ = "interview_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)

    status = Column(
        SAEnum(InterviewSessionStatus, name="interview_session_status"),
        nullable=False,
        default=InterviewSessionStatus.CREATED,
    )

    role_config = Column(String, nullable=False)
    question_graph = Column(String, nullable=False)

    evaluation = Column(JSON, nullable=True)
    error_message = Column(String, nullable=True)

    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
