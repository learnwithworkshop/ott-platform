"""
Database utilities for connection management, health checks, and database operations.
"""

import logging
from typing import Optional
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError, DatabaseError

from app.db.session import engine, SessionLocal

logger = logging.getLogger(__name__)


class DatabaseManager:
    """Utility class for database operations and management."""

    @staticmethod
    def health_check() -> dict:
        """
        Check database health and connection status.
        Returns: {status: "healthy"/"unhealthy", message: str, details: dict}
        """
        try:
            with engine.connect() as conn:
                result = conn.execute(text("SELECT 1"))
                stats = engine.pool.status()
                
                return {
                    "status": "healthy",
                    "message": "Database connection successful",
                    "details": {
                        "pool_status": stats,
                        "pool_size": engine.pool.size(),
                    }
                }
        except OperationalError as e:
            logger.error(f"Database operational error: {str(e)}")
            return {
                "status": "unhealthy",
                "message": f"Database connection failed: {str(e)}",
                "details": {}
            }
        except DatabaseError as e:
            logger.error(f"Database error: {str(e)}")
            return {
                "status": "unhealthy",
                "message": f"Database error: {str(e)}",
                "details": {}
            }
        except Exception as e:
            logger.error(f"Unexpected error during health check: {str(e)}")
            return {
                "status": "unhealthy",
                "message": f"Unexpected error: {str(e)}",
                "details": {}
            }

    @staticmethod
    def get_connection_info() -> dict:
        """
        Get current connection pool information.
        """
        try:
            return {
                "pool_size": engine.pool.size(),
                "connections_in_use": len(engine.pool._all_conns) - len(engine.pool._queue.qsize()),
                "pool_status": engine.pool.status(),
            }
        except Exception as e:
            logger.error(f"Error getting connection info: {str(e)}")
            return {}

    @staticmethod
    def dispose_connections() -> None:
        """
        Dispose all connections in the pool.
        Useful for cleanup or connection reset.
        """
        try:
            engine.dispose()
            logger.info("All database connections disposed")
        except Exception as e:
            logger.error(f"Error disposing connections: {str(e)}")

    @staticmethod
    def execute_query(query: str, params: Optional[dict] = None) -> Optional[list]:
        """
        Execute a raw SQL query (read-only, safe for SELECT).
        Use ORM for write operations.
        """
        try:
            db = SessionLocal()
            result = db.execute(text(query), params or {})
            db.close()
            return result.fetchall()
        except Exception as e:
            logger.error(f"Error executing query: {str(e)}")
            return None

    @staticmethod
    def get_table_info(table_name: str) -> dict:
        """
        Get information about a database table.
        Returns: {row_count, columns, indexes}
        """
        try:
            db = SessionLocal()
            
            # Get row count
            count_query = f"SELECT COUNT(*) as count FROM {table_name}"
            count_result = db.execute(text(count_query)).fetchone()
            row_count = count_result[0] if count_result else 0
            
            # Get column info
            columns_query = f"""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns
                WHERE table_name = '{table_name}'
            """
            columns_result = db.execute(text(columns_query)).fetchall()
            columns = [
                {
                    "name": col[0],
                    "type": col[1],
                    "nullable": col[2]
                }
                for col in columns_result
            ]
            
            db.close()
            
            return {
                "table_name": table_name,
                "row_count": row_count,
                "columns": columns,
            }
        except Exception as e:
            logger.error(f"Error getting table info: {str(e)}")
            return {}

    @staticmethod
    def vacuum_database() -> bool:
        """
        Run VACUUM on PostgreSQL to clean up dead tuples.
        Only works with PostgreSQL.
        Should run periodically (e.g., daily).
        """
        try:
            # Note: VACUUM cannot run inside a transaction
            from sqlalchemy import event
            from sqlalchemy.pool import Pool
            
            @event.listens_for(Pool, "connect")
            def receive_connect(dbapi_conn, connection_record):
                dbapi_conn.set_isolation_level(0)
                cursor = dbapi_conn.cursor()
                cursor.execute("VACUUM")
                cursor.close()
                dbapi_conn.set_isolation_level(1)
            
            logger.info("Database VACUUM completed")
            return True
        except Exception as e:
            logger.error(f"Error running VACUUM: {str(e)}")
            return False

    @staticmethod
    def analyze_database() -> bool:
        """
        Run ANALYZE on PostgreSQL to update table statistics.
        Helps query planner optimize queries.
        """
        try:
            db = SessionLocal()
            db.execute(text("ANALYZE"))
            db.commit()
            db.close()
            logger.info("Database ANALYZE completed")
            return True
        except Exception as e:
            logger.error(f"Error running ANALYZE: {str(e)}")
            return False


# Monitoring and logging utilities
def log_query_error(error: Exception, query: str = None):
    """Log database query errors with context."""
    if query:
        logger.error(f"Query error: {str(error)}\nQuery: {query}")
    else:
        logger.error(f"Query error: {str(error)}")


def log_connection_error(error: Exception, operation: str = "database operation"):
    """Log database connection errors."""
    logger.error(f"Connection error during {operation}: {str(error)}")
