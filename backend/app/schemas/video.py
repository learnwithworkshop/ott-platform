from typing import Optional
from datetime import datetime

from pydantic import BaseModel, Field, ConfigDict


class VideoBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    file_path: Optional[str] = None
    thumbnail_path: Optional[str] = None
    duration: Optional[int] = None
    is_published: Optional[bool] = False


class VideoCreate(VideoBase):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    file_path: str = Field(..., min_length=1)


class VideoUpdate(VideoBase):
    pass


class Video(VideoBase):
    id: int = Field(..., description="Video ID")
    title: str
    description: str
    owner_id: int = Field(..., description="Owner user ID")
    view_count: int = Field(default=0)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)