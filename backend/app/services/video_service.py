from sqlalchemy.orm import Session
from app.models.video import Video


def get_video_by_id(db: Session, video_id: int) -> Video | None:
    return db.query(Video).filter(Video.id == video_id).first()


def get_videos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Video).offset(skip).limit(limit).all()


# VideoService class - services/__init__.py ke liye
class VideoService:
    @staticmethod
    def get_by_id(db: Session, video_id: int) -> Video | None:
        return get_video_by_id(db, video_id)

    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 100):
        return get_videos(db, skip=skip, limit=limit)