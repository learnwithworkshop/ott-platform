from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class Episode(Base):
    __tablename__ = "episodes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    episode_number = Column(Integer, nullable=False)
    season_number = Column(Integer, default=1, nullable=False)
    file_path = Column(String(512), nullable=False)
    duration = Column(Integer, nullable=True)  # in seconds
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    
    # Timestamps for audit trail
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    video = relationship("Video", back_populates="episodes")

    def __repr__(self):
        return f"<Episode(id={self.id}, season={self.season_number}, episode={self.episode_number})>"