import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator


class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "OTT Platform"
    ENVIRONMENT: str = Field(default="development", json_schema_extra={"env": "ENVIRONMENT"})
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = Field(default=False, json_schema_extra={"env": "DEBUG"})

    # Security - MUST be set via environment variables
    SECRET_KEY: str = Field(default="", json_schema_extra={"env": "SECRET_KEY"})
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=480, json_schema_extra={"env": "ACCESS_TOKEN_EXPIRE_MINUTES"})
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7, json_schema_extra={"env": "REFRESH_TOKEN_EXPIRE_DAYS"})
    
    # Password policy
    MIN_PASSWORD_LENGTH: int = 12
    REQUIRE_SPECIAL_CHARS: bool = True
    REQUIRE_NUMBERS: bool = True
    REQUIRE_UPPERCASE: bool = True
    REQUIRE_LOWERCASE: bool = True

    # Database - PostgreSQL in production
    DATABASE_URL: str = Field(default="", json_schema_extra={"env": "DATABASE_URL"})
    DB_ECHO: bool = Field(default=False, json_schema_extra={"env": "DB_ECHO"})
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 40
    DB_POOL_PRE_PING: bool = True

    # Redis (REQUIRED for Celery)
    REDIS_URL: str = Field(default="", json_schema_extra={"env": "REDIS_URL"})

    # Celery
    CELERY_BROKER_URL: str = Field(default="", json_schema_extra={"env": "CELERY_BROKER_URL"})
    CELERY_RESULT_BACKEND: str = Field(default="", json_schema_extra={"env": "CELERY_RESULT_BACKEND"})

    # CORS - Restrict to specific origins
    BACKEND_CORS_ORIGINS: List[str] = Field(
        default=["http://localhost:3000"],
        json_schema_extra={"env": "CORS_ORIGINS"}
    )
    ALLOWED_HOSTS: List[str] = Field(
        default=["localhost", "127.0.0.1"],
        json_schema_extra={"env": "ALLOWED_HOSTS"}
    )

    # Security Headers
    ALLOW_CREDENTIALS: bool = True
    MAX_BODY_SIZE: int = 5 * 1024 * 1024 * 1024  # 5GB for videos

    # Rate Limiting
    ENABLE_RATE_LIMITING: bool = True
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60

    # JWT
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 8

    # File Upload
    UPLOAD_DIR: str = Field(default="uploads", json_schema_extra={"env": "UPLOAD_DIR"})
    MAX_UPLOAD_SIZE: int = 5 * 1024 * 1024 * 1024
    ALLOWED_VIDEO_EXTENSIONS: List[str] = ["mp4", "mkv", "avi", "mov", "flv", "webm"]
    ALLOWED_IMAGE_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "gif", "webp"]

    # Email
    SMTP_HOST: str = Field(default="", json_schema_extra={"env": "SMTP_HOST"})
    SMTP_PORT: int = Field(default=587, json_schema_extra={"env": "SMTP_PORT"})
    SMTP_USER: str = Field(default="", json_schema_extra={"env": "SMTP_USER"})
    SMTP_PASSWORD: str = Field(default="", json_schema_extra={"env": "SMTP_PASSWORD"})
    EMAILS_ENABLED: bool = False

    # Third-party APIs
    STRIPE_SECRET_KEY: str = Field(default="", json_schema_extra={"env": "STRIPE_SECRET_KEY"})
    RAZORPAY_KEY_ID: str = Field(default="", json_schema_extra={"env": "RAZORPAY_KEY_ID"})
    RAZORPAY_KEY_SECRET: str = Field(default="", json_schema_extra={"env": "RAZORPAY_KEY_SECRET"})

    # AWS S3
    AWS_ACCESS_KEY_ID: str = Field(default="", json_schema_extra={"env": "AWS_ACCESS_KEY_ID"})
    AWS_SECRET_ACCESS_KEY: str = Field(default="", json_schema_extra={"env": "AWS_SECRET_ACCESS_KEY"})
    AWS_S3_BUCKET: str = Field(default="", json_schema_extra={"env": "AWS_S3_BUCKET"})
    AWS_REGION: str = Field(default="us-east-1", json_schema_extra={"env": "AWS_REGION"})

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v):
        if not v:
            raise ValueError("SECRET_KEY must be set via environment variable")
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long")
        return v

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v):
        if not v:
            raise ValueError("DATABASE_URL must be set via environment variable")
        return v

    @field_validator("REDIS_URL")
    @classmethod
    def validate_redis_url(cls, v):
        if not v:
            raise ValueError("REDIS_URL must be set via environment variable")
        return v


settings = Settings()