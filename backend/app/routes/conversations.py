from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from app.core.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.models.message import Message
from app.models.contact import Contact

router = APIRouter(prefix="/conversations", tags=["Conversations"])

@router.get("", response_model=List[Dict[str, Any]])
def get_conversations(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all conversations grouped by contact.
    """
    # 1. Get distinct contact_ids from messages
    # This is a bit inefficient, but without a Conversation model, we aggregate on the fly
    
    # Get all contacts that have messages
    contacts_with_messages = db.query(Contact).join(Message).distinct().all()
    
    conversations = []
    
    for contact in contacts_with_messages:
        # Get messages for this contact
        messages = db.query(Message).filter(
            Message.contact_id == contact.id
        ).order_by(Message.created_at.asc()).all()
        
        if not messages:
            continue
            
        last_message = messages[-1]
        
        # Calculate unread count (incoming messages that are not read)
        # Assuming we don't have a 'read' status yet, logic would go here.
        # For now, just a placeholder or based on status if applicable.
        unread_count = 0 
        
        conversations.append({
            "id": str(contact.id), # Use contact ID as conversation ID
            "contactId": contact.id,
            "contactName": f"{contact.first_name} {contact.last_name}",
            "contactEmail": contact.email,
            "contactPhone": contact.phone,
            "messages": [
                {
                    "id": str(m.id),
                    "content": m.content,
                    "sender": "staff" if m.direction == "outgoing" else "contact",
                    "channel": m.channel,
                    "timestamp": m.created_at.isoformat(),
                    "status": m.status
                } for m in messages
            ],
            "lastMessage": {
                "content": last_message.content,
                "timestamp": last_message.created_at.isoformat()
            },
            "unreadCount": unread_count,
            "status": "Open", # Default status
            "updatedAt": last_message.created_at.isoformat(),
            "automationStatus": "Active" # Placeholder
        })
    
    # Sort by updated_at desc
    conversations.sort(key=lambda x: x["updatedAt"], reverse=True)
    
    return conversations[skip : skip + limit]

@router.get("/{id}", response_model=Dict[str, Any])
def get_conversation(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a single conversation by ID (Contact ID)."""
    contact = db.query(Contact).filter(Contact.id == id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    messages = db.query(Message).filter(
        Message.contact_id == id
    ).order_by(Message.created_at.asc()).all()
    
    return {
        "id": str(contact.id),
        "contactId": contact.id,
        "contactName": f"{contact.first_name} {contact.last_name}",
        "contactEmail": contact.email,
        "contactPhone": contact.phone,
        "messages": [
            {
                "id": str(m.id),
                "content": m.content,
                "sender": "staff" if m.direction == "outgoing" else "contact",
                "channel": m.channel,
                "timestamp": m.created_at.isoformat(),
                "status": m.status
            } for m in messages
        ],
        "status": "Open",
        "automationStatus": "Active"
    }

@router.post("/{id}/messages", status_code=status.HTTP_201_CREATED)
def send_message(
    id: int,
    message_data: Dict[str, Any],
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a message to a conversation."""
    contact = db.query(Contact).filter(Contact.id == id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
        
    new_message = Message(
        contact_id=id,
        staff_id=current_user.id,
        content=message_data.get("content"),
        channel=message_data.get("channel", "email"),
        direction="outgoing",
        status="sent"
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return {
        "id": str(new_message.id),
        "content": new_message.content,
        "sender": "staff",
        "channel": new_message.channel,
        "timestamp": new_message.created_at.isoformat(),
        "status": new_message.status
    }
