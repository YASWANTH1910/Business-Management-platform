from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.models.message import Message
from app.schemas.message_schema import MessageCreate, MessageResponse

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.post("", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def create_message(
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new message."""
    message = Message(**message_data.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    
    return MessageResponse.model_validate(message)


@router.get("/{contact_id}", response_model=List[MessageResponse])
def get_messages_by_contact(
    contact_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all messages for a specific contact."""
    messages = db.query(Message).filter(
        Message.contact_id == contact_id
    ).order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
    
    return [MessageResponse.model_validate(m) for m in messages]


@router.get("", response_model=List[MessageResponse])
def get_all_messages(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all messages with pagination."""
    messages = db.query(Message).order_by(
        Message.created_at.desc()
    ).offset(skip).limit(limit).all()
    
    return [MessageResponse.model_validate(m) for m in messages]
