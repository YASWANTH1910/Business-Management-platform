from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.models.booking import BookingStatus
from app.schemas.booking_schema import BookingCreate, BookingUpdate, BookingResponse
from app.services.booking_service import BookingService

router = APIRouter(prefix="/bookings", tags=["Bookings"])


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new booking.
    
    EVENT TRIGGER: Sends confirmation message via automation.
    """
    service = BookingService(db)
    booking = service.create_booking(booking_data)
    return BookingResponse.model_validate(booking)


@router.get("", response_model=List[BookingResponse])
def get_bookings(
    skip: int = 0,
    limit: int = 100,
    status: Optional[BookingStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all bookings with pagination and optional status filter."""
    service = BookingService(db)
    bookings = service.get_bookings(skip=skip, limit=limit, status=status)
    return [BookingResponse.model_validate(b) for b in bookings]


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get booking by ID."""
    service = BookingService(db)
    booking = service.get_booking(booking_id)
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Booking {booking_id} not found"
        )
    return BookingResponse.model_validate(booking)


@router.patch("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    booking_data: BookingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update booking details."""
    service = BookingService(db)
    try:
        booking = service.update_booking(booking_id, booking_data)
        return BookingResponse.model_validate(booking)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/{booking_id}/send-reminder", status_code=status.HTTP_200_OK)
def send_booking_reminder(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually send booking reminder."""
    service = BookingService(db)
    try:
        service.send_reminder(booking_id)
        return {"message": "Reminder sent successfully"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.post("/{booking_id}/send-form-reminder", status_code=status.HTTP_200_OK)
def send_form_reminder(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Manually send form completion reminder."""
    service = BookingService(db)
    try:
        service.send_form_reminder(booking_id)
        return {"message": "Form reminder sent successfully"}
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
