from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator, constr
from datetime import datetime


# ===== REQUEST SCHEMAS =====

class LoginRequest(BaseModel):
    """Login request with email and password."""
    email: EmailStr = Field(..., description="User email address")
    password: constr(min_length=8, max_length=128) = Field(..., description="User password")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123!"
            }
        }


class RegisterRequest(BaseModel):
    """User registration with strong password validation."""
    email: EmailStr = Field(..., description="User email address")
    password: constr(min_length=12, max_length=128) = Field(
        ..., 
        description="Password (min 12 chars, uppercase, lowercase, number, special char)"
    )
    full_name: Optional[constr(min_length=2, max_length=100)] = Field(
        None, 
        description="Full name of the user"
    )
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        errors = []
        if not any(c.isupper() for c in v):
            errors.append("uppercase letter")
        if not any(c.islower() for c in v):
            errors.append("lowercase letter")
        if not any(c.isdigit() for c in v):
            errors.append("number")
        if not any(c in "!@#$%^&*()_+-=[]{}';:\",.<>?" for c in v):
            errors.append("special character")
        
        if errors:
            raise ValueError(f"Password must contain: {', '.join(errors)}")
        return v
    
    @field_validator('full_name')
    @classmethod
    def validate_full_name(cls, v):
        if v and any(char in v for char in ['<', '>', '"', "'", '&', ';', '/']):
            raise ValueError("Full name contains invalid characters")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123!",
                "full_name": "John Doe"
            }
        }


class PasswordChangeRequest(BaseModel):
    """Change password request."""
    old_password: str = Field(..., description="Current password")
    new_password: constr(min_length=12, max_length=128) = Field(
        ..., 
        description="New password"
    )
    
    @field_validator('new_password')
    @classmethod
    def validate_new_password(cls, v):
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain uppercase letters")
        if not any(c.islower() for c in v):
            raise ValueError("Password must contain lowercase letters")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain numbers")
        if not any(c in "!@#$%^&*()_+-=[]{}';:\",.<>?" for c in v):
            raise ValueError("Password must contain special characters")
        return v


class PasswordResetRequest(BaseModel):
    """Password reset request."""
    email: EmailStr = Field(..., description="User email address")


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation with token."""
    token: str = Field(..., description="Reset token")
    new_password: constr(min_length=12, max_length=128) = Field(
        ..., 
        description="New password"
    )


# ===== RESPONSE SCHEMAS =====

class TokenResponse(BaseModel):
    """Token response after successful login."""
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration in seconds")
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "expires_in": 28800
            }
        }


class RefreshTokenRequest(BaseModel):
    """Refresh token request."""
    refresh_token: str = Field(..., description="JWT refresh token")


# ===== TOKEN PAYLOAD =====

class TokenData(BaseModel):
    """JWT token payload data."""
    email: Optional[EmailStr] = None
    user_id: Optional[int] = None
    token_type: str = "access"
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "user_id": 1,
                "token_type": "access"
            }
        }
