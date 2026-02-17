from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from app.models.user import UserRole


# Request Schemas
class UserCreate(BaseModel):
    """Schema for creating a new user."""
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.STAFF


class UserLogin(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """Schema for updating user details."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None


# Response Schemas
class UserResponse(BaseModel):
    """Schema for user response (excludes password)."""
    id: int
    name: str
    email: str
    role: UserRole
    created_at: datetime
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for authentication token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
