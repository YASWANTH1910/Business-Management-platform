from sqlalchemy import Column, Integer, String, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base


class UserRole(str, enum.Enum):
    """User role enumeration."""
    ADMIN = "admin"
    STAFF = "staff"


class User(Base):
    """
    User model for authentication and authorization.
    
    Roles:
    - admin: Full access to all features
    - staff: Limited access (cannot modify system logic)
    """
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(60), nullable=False)  # Bcrypt hash is always 60 chars
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.STAFF)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    bookings_assigned = relationship("Booking", back_populates="staff", foreign_keys="Booking.staff_id")
    messages_sent = relationship("Message", back_populates="staff", foreign_keys="Message.staff_id")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"
