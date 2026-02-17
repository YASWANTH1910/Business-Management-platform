from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from app.core.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.models.booking import Booking, BookingStatus
from app.models.contact import Contact
from app.models.inventory import Inventory
from app.models.alert import Alert
from app.models.message import Message, MessageDirection

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("")
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dashboard statistics and overview.
    
    Returns key metrics for the business operations.
    """
    today = datetime.utcnow().date()
    week_ago = datetime.utcnow() - timedelta(days=7)
    
    # Booking stats
    total_bookings = db.query(Booking).count()
    todays_bookings = db.query(Booking).filter(
        func.date(Booking.start_time) == today
    ).count()
    upcoming_bookings = db.query(Booking).filter(
        Booking.start_time > datetime.utcnow(),
        Booking.status.in_([BookingStatus.PENDING, BookingStatus.CONFIRMED])
    ).count()
    
    # Contact stats
    total_contacts = db.query(Contact).count()
    new_contacts_this_week = db.query(Contact).filter(
        Contact.created_at >= week_ago
    ).count()
    
    # Inventory stats
    total_inventory_items = db.query(Inventory).count()
    low_stock_items = db.query(Inventory).filter(
        Inventory.quantity < Inventory.threshold
    ).count()
    
    # Alert stats
    active_alerts = db.query(Alert).filter(
        Alert.is_dismissed == False
    ).count()
    critical_alerts = db.query(Alert).filter(
        Alert.is_dismissed == False,
        Alert.severity == "critical"
    ).count()
    
    # Message stats
    total_messages = db.query(Message).count()
    unanswered_messages = db.query(Message).filter(
        Message.direction == MessageDirection.INCOMING,
        ~Message.contact_id.in_(
            db.query(Message.contact_id).filter(
                Message.direction == MessageDirection.OUTGOING,
                Message.staff_id.isnot(None)
            )
        )
    ).count()
    
    return {
        "bookings": {
            "total": total_bookings,
            "today": todays_bookings,
            "upcoming": upcoming_bookings
        },
        "contacts": {
            "total": total_contacts,
            "new_this_week": new_contacts_this_week
        },
        "inventory": {
            "total_items": total_inventory_items,
            "low_stock_items": low_stock_items
        },
        "alerts": {
            "active": active_alerts,
            "critical": critical_alerts
        },
        "messages": {
            "total": total_messages,
            "unanswered": unanswered_messages
        }
    }
