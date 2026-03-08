from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.dependencies import get_current_active_user
from app.core.security import create_access_token
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import TokenResponse, RegisterRequest

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """Login - access token lo"""
    from app.services.auth_service import authenticate_user
    user = authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(user.id, expires_delta=access_token_expires)
    return {
        "access_token": access_token,
        "refresh_token": access_token,  # abhi ke liye same
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }

@router.post("/register")
def register_user(
    *,
    db: Session = Depends(get_db),
    user_in: RegisterRequest,
) -> Any:
    """Naya user banao"""
    from app.services.auth_service import create_user
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="Is email se user pehle se exist karta hai.",
        )
    user = create_user(db, user_in)
    return {"message": "User successfully registered", "email": user.email}

@router.get("/me")
def read_users_me(current_user: User = Depends(get_current_active_user)):
    """Current user ki info lo"""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
    }