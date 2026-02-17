# Import all models to ensure they're registered with SQLAlchemy Base
from app.models.user import User, UserRole
from app.models.contact import Contact
from app.models.booking import Booking, BookingStatus, FormStatus
from app.models.inventory import Inventory
from app.models.alert import Alert, AlertType, AlertSeverity
from app.models.message import Message, MessageChannel, MessageDirection, MessageStatus

__all__ = [
    "User",
    "UserRole",
    "Contact",
    "Booking",
    "BookingStatus",
    "FormStatus",
    "Inventory",
    "Alert",
    "AlertType",
    "AlertSeverity",
    "Message",
    "MessageChannel",
    "MessageDirection",
    "MessageStatus",
]
