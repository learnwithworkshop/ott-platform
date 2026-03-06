from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    full_name: Optional[str] = None


class UserCreate(UserBase):
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=12, description="User password")
    full_name: Optional[str] = Field(None, description="Full name of user")


class UserUpdate(UserBase):
    password: Optional[str] = Field(None, min_length=12)


class User(UserBase):
    id: int = Field(..., description="User ID")
    email: EmailStr
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)