from sqlalchemy.orm import Session
from app.models.booking import Booking, BookingStatus
from app.schemas.booking_schema import BookingCreate, BookingUpdate
from app.services.automation_service import AutomationService
from app.core.logger import log_info


class BookingService:
    """
    Booking service with event-based automation triggers.
    
    All automation is explicitly triggered from this service layer.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.automation = AutomationService(db)
    
    def create_booking(self, booking_data: BookingCreate) -> Booking:
        """
        Create a new booking.
        
        EVENT TRIGGER: handle_booking_created
        """
        log_info(f"[SERVICE] Creating booking for contact {booking_data.contact_id}")
        
        # Create booking
        booking = Booking(**booking_data.model_dump())
        self.db.add(booking)
        self.db.commit()
        self.db.refresh(booking)
        
        log_info(f"[SERVICE] Booking created: {booking.id}")
        
        # EXPLICIT EVENT TRIGGER
        self.automation.handle_booking_created(booking)
        
        return booking
    
    def update_booking(self, booking_id: int, booking_data: BookingUpdate) -> Booking:
        """
        Update an existing booking.
        
        No automatic event triggers on update.
        Events must be triggered explicitly if needed.
        """
        log_info(f"[SERVICE] Updating booking {booking_id}")
        
        booking = self.db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise ValueError(f"Booking {booking_id} not found")
        
        # Update fields
        update_data = booking_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(booking, field, value)
        
        self.db.commit()
        self.db.refresh(booking)
        
        log_info(f"[SERVICE] Booking updated: {booking.id}")
        return booking
    
    def get_booking(self, booking_id: int) -> Booking:
        """Get booking by ID."""
        return self.db.query(Booking).filter(Booking.id == booking_id).first()
    
    def get_bookings(
        self,
        skip: int = 0,
        limit: int = 100,
        status: BookingStatus = None
    ) -> list[Booking]:
        """Get bookings with pagination and optional status filter."""
        query = self.db.query(Booking)
        
        if status:
            query = query.filter(Booking.status == status)
        
        return query.offset(skip).limit(limit).all()
    
    def send_reminder(self, booking_id: int):
        """
        Manually trigger booking reminder.
        
        EVENT TRIGGER: handle_booking_reminder
        """
        log_info(f"[SERVICE] Sending reminder for booking {booking_id}")
        
        booking = self.get_booking(booking_id)
        if not booking:
            raise ValueError(f"Booking {booking_id} not found")
        
        # EXPLICIT EVENT TRIGGER
        self.automation.handle_booking_reminder(booking)
    
    def send_form_reminder(self, booking_id: int):
        """
        Manually trigger form reminder.
        
        EVENT TRIGGER: handle_form_pending_reminder
        """
        log_info(f"[SERVICE] Sending form reminder for booking {booking_id}")
        
        booking = self.get_booking(booking_id)
        if not booking:
            raise ValueError(f"Booking {booking_id} not found")
        
        # EXPLICIT EVENT TRIGGER
        self.automation.handle_form_pending_reminder(booking)
