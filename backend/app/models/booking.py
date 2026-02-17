from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class BookingStatus(str, enum.Enum):
    """Booking status enumeration."""
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    NO_SHOW = "no_show"
    CANCELLED = "cancelled"


class FormStatus(str, enum.Enum):
    """Form completion status enumeration."""
    PENDING = "pending"
    COMPLETED = "completed"


class Booking(Base):
    """
    Booking model for appointments/reservations.
    
    Event triggers:
    - On create: Send confirmation message (via automation_service)
    - Before start_time: Send reminder (via automation_service)
    - On form pending: Send form reminder (via automation_service)
    """
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    contact_id = Column(Integer, ForeignKey("contacts.id", ondelete="CASCADE"), nullable=False, index=True)
    staff_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    status = Column(SQLEnum(BookingStatus), nullable=False, default=BookingStatus.PENDING, index=True)
    form_status = Column(SQLEnum(FormStatus), nullable=False, default=FormStatus.PENDING)
    start_time = Column(DateTime, nullable=False, index=True)
    end_time = Column(DateTime, nullable=False)
    service_type = Column(String(255), nullable=True)
    notes = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    # Relationships
    contact = relationship("Contact", back_populates="bookings")
    staff = relationship("User", back_populates="bookings_assigned", foreign_keys=[staff_id])
    
    def __repr__(self):
        return f"<Booking(id={self.id}, contact_id={self.contact_id}, status={self.status}, start_time={self.start_time})>"
