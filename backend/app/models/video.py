from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base import Base


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=True)
    file_path = Column(String(512), nullable=False)
    thumbnail_path = Column(String(512), nullable=True)
    duration = Column(Integer, nullable=True)  # in seconds
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    region = Column(String(100), nullable=True, index=True)  # Jharkhand, West Bengal, Odisha, Assam
    
    # Subtitle support
    subtitle_santhali_path = Column(String(512), nullable=True)  # .vtt or .srt file
    subtitle_hindi_path = Column(String(512), nullable=True)     # .vtt or .srt file
    subtitle_english_path = Column(String(512), nullable=True)   # .vtt or .srt file
    
    is_published = Column(Boolean, default=False, nullable=False)
    view_count = Column(Integer, default=0, nullable=False)
    
    # Timestamps for audit trail
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    owner = relationship("User", back_populates="videos")
    category = relationship("Category", back_populates="videos")
    episodes = relationship("Episode", back_populates="video", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Video(id={self.id}, title={self.title}, owner_id={self.owner_id}, category_id={self.category_id}, region={self.region})>"