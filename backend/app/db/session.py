from sqlalchemy import create_engine, event, exc
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool, QueuePool
import logging
import time
from typing import Generator

from app.core.config import settings

logger = logging.getLogger(__name__)

# Create engine with connection pooling and pre-ping enabled
# pre_ping ensures connections are alive before using them
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_pre_ping=settings.DB_POOL_PRE_PING,
    echo=settings.DB_ECHO,
    connect_args={
        "connect_timeout": 10,
        "application_name": "ott_platform",
    }
)

# Connection pooling event listeners for monitoring
@event.listens_for(engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """Log when a connection is created."""
    logger.debug("Database connection established")

@event.listens_for(engine, "close")
def receive_close(dbapi_conn, connection_record):
    """Log when a connection is closed."""
    logger.debug("Database connection closed")

@event.listens_for(engine, "detach")
def receive_detach(dbapi_conn, connection_record):
    """Log when a connection is detached."""
    logger.debug("Database connection detached")

@event.listens_for(engine, "checkin")
def receive_checkin(dbapi_conn, connection_record):
    """Log when a connection is returned to pool."""
    logger.debug("Database connection returned to pool")

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency for getting a database session.
    Ensures session is properly closed after use.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except exc.SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        db.rollback()
        raise
    except Exception as e:
        logger.error(f"Unexpected error during database operation: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


def health_check() -> bool:
    """
    Check if database connection is healthy.
    Used for application health checks.
    """
    try:
        with engine.connect() as conn:
            result = conn.execute("SELECT 1")
            return result is not None
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        return False