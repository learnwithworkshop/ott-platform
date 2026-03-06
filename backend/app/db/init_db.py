from sqlalchemy.orm import Session
import logging

from app.db.session import SessionLocal, engine
from app.db.base import Base

logger = logging.getLogger(__name__)


def init_db(db: Session = None) -> None:
    """
    Initialize database by creating all tables.
    Import all models to ensure they are registered with SQLAlchemy.
    """
    # Import all models to register them with SQLAlchemy
    from app.models import user, video, episode, subscription  # noqa: F401

    logger.info("Creating database tables...")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        logger.info("✓ Database tables created successfully")
    except Exception as e:
        logger.error(f"✗ Error creating database tables: {str(e)}")
        raise


def drop_all_tables() -> None:
    """
    Drop all tables from the database.
    WARNING: This will delete all data!
    Only use in development.
    """
    from app.models import user, video, episode, subscription  # noqa: F401
    
    logger.warning("Dropping all database tables...")
    Base.metadata.drop_all(bind=engine)
    logger.warning("✓ All tables dropped")


def recreate_database() -> None:
    """
    Drop and recreate all tables.
    WARNING: This will delete all data!
    Only use in development.
    """
    drop_all_tables()
    init_db()
    logger.info("✓ Database recreated successfully")