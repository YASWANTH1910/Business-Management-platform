from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# Request Schemas
class ContactCreate(BaseModel):
    """Schema for creating a new contact."""
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class ContactUpdate(BaseModel):
    """Schema for updating contact details."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


# Response Schemas
class ContactResponse(BaseModel):
    """Schema for contact response."""
    id: int
    name: str
    email: Optional[str]
    phone: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
