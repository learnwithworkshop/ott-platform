from datetime import datetime, timedelta
from typing import Any, Union, Optional
import re
import secrets
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Password hashing with bcrypt - 12 rounds for strong security
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
)


def validate_password_strength(password: str) -> tuple[bool, str]:
    """
    Validate password meets security requirements.
    Returns: (is_valid, message)
    """
    if len(password) < settings.MIN_PASSWORD_LENGTH:
        return False, f"Password must be at least {settings.MIN_PASSWORD_LENGTH} characters"
    
    if settings.REQUIRE_UPPERCASE and not re.search(r"[A-Z]", password):
        return False, "Password must contain at least one uppercase letter"
    
    if settings.REQUIRE_LOWERCASE and not re.search(r"[a-z]", password):
        return False, "Password must contain at least one lowercase letter"
    
    if settings.REQUIRE_NUMBERS and not re.search(r"[0-9]", password):
        return False, "Password must contain at least one number"
    
    if settings.REQUIRE_SPECIAL_CHARS and not re.search(r"[!@#$%^&*()_+\-=\[\]{};:'\",.<>?/]", password):
        return False, "Password must contain at least one special character (!@#$%^&*)"
    
    return True, "Password is strong"


def get_password_hash(password: str) -> str:
    """Hash password with bcrypt (12 rounds)."""
    is_valid, message = validate_password_strength(password)
    if not is_valid:
        raise ValueError(message)
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against hash using constant-time comparison."""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        logger.error(f"Password verification error: {str(e)}")
        return False


def create_access_token(
    subject: Union[str, Any], 
    expires_delta: Optional[timedelta] = None,
    token_type: str = "access"
) -> str:
    """Create JWT access token with expiration and token type."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "type": token_type,
        "iat": datetime.utcnow(),
        "jti": secrets.token_urlsafe(16),
    }
    
    try:
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.SECRET_KEY, 
            algorithm=settings.JWT_ALGORITHM
        )
        return encoded_jwt
    except Exception as e:
        logger.error(f"Token creation error: {str(e)}")
        raise


def create_refresh_token(subject: Union[str, Any]) -> str:
    """Create JWT refresh token with longer expiration."""
    expires_delta = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    return create_access_token(subject, expires_delta, token_type="refresh")


def decode_token(token: str, token_type: str = "access") -> Optional[dict]:
    """Decode and validate JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        if payload.get("type") != token_type:
            logger.warning(f"Invalid token type")
            return None
        
        return payload
    except JWTError as e:
        logger.warning(f"JWT decode error: {str(e)}")
        return None
    except Exception as e:
        logger.error(f"Token decode error: {str(e)}")
        return None


def generate_secure_token(length: int = 32) -> str:
    """Generate cryptographically secure random token."""
    return secrets.token_urlsafe(length)