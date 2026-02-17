from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.logger import log_info, log_error
from app.models.message import Message, MessageChannel, MessageDirection, MessageStatus
from app.models.alert import Alert, AlertType, AlertSeverity


class IntegrationService:
    """
    Integration service for external communications.
    
    CRITICAL DESIGN PRINCIPLE:
    - Integration failures MUST NOT break core business flow
    - All failures are logged and create alerts
    - Returns status for tracking, but doesn't raise exceptions
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def send_email(
        self,
        to_email: str,
        subject: str,
        content: str,
        contact_id: int,
        staff_id: Optional[int] = None
    ) -> bool:
        """
        Send email via integration (SendGrid/SMTP).
        
        Returns:
            True if sent successfully, False otherwise
        """
        message = Message(
            contact_id=contact_id,
            staff_id=staff_id,
            channel=MessageChannel.EMAIL,
            direction=MessageDirection.OUTGOING,
            status=MessageStatus.PENDING,
            content=content,
            subject=subject
        )
        
        try:
            # TODO: Implement actual SendGrid integration
            # For now, simulate success
            log_info(f"[INTEGRATION] Sending email to {to_email}: {subject}")
            
            # Simulate email sending
            message.status = MessageStatus.SENT
            message.sent_at = datetime.utcnow()
            
            self.db.add(message)
            self.db.commit()
            
            log_info(f"[INTEGRATION] Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            log_error(f"[INTEGRATION] Failed to send email to {to_email}: {str(e)}", exc_info=True)
            
            # Update message status
            message.status = MessageStatus.FAILED
            message.error_message = str(e)
            self.db.add(message)
            
            # Create integration alert
            alert = Alert(
                type=AlertType.INTEGRATION,
                severity=AlertSeverity.WARNING,
                message=f"Failed to send email to {to_email}",
                details=f"Error: {str(e)}"
            )
            self.db.add(alert)
            
            self.db.commit()
            return False
    
    def send_sms(
        self,
        to_phone: str,
        content: str,
        contact_id: int,
        staff_id: Optional[int] = None
    ) -> bool:
        """
        Send SMS via integration (Twilio).
        
        Returns:
            True if sent successfully, False otherwise
        """
        message = Message(
            contact_id=contact_id,
            staff_id=staff_id,
            channel=MessageChannel.SMS,
            direction=MessageDirection.OUTGOING,
            status=MessageStatus.PENDING,
            content=content
        )
        
        try:
            # TODO: Implement actual Twilio integration
            # For now, simulate success
            log_info(f"[INTEGRATION] Sending SMS to {to_phone}")
            
            # Simulate SMS sending
            message.status = MessageStatus.SENT
            message.sent_at = datetime.utcnow()
            
            self.db.add(message)
            self.db.commit()
            
            log_info(f"[INTEGRATION] SMS sent successfully to {to_phone}")
            return True
            
        except Exception as e:
            log_error(f"[INTEGRATION] Failed to send SMS to {to_phone}: {str(e)}", exc_info=True)
            
            # Update message status
            message.status = MessageStatus.FAILED
            message.error_message = str(e)
            self.db.add(message)
            
            # Create integration alert
            alert = Alert(
                type=AlertType.INTEGRATION,
                severity=AlertSeverity.WARNING,
                message=f"Failed to send SMS to {to_phone}",
                details=f"Error: {str(e)}"
            )
            self.db.add(alert)
            
            self.db.commit()
            return False
    
    def create_calendar_event(
        self,
        title: str,
        start_time: datetime,
        end_time: datetime,
        attendee_email: str
    ) -> bool:
        """
        Create calendar event via integration (Google Calendar/Outlook).
        
        Returns:
            True if created successfully, False otherwise
        """
        try:
            # TODO: Implement actual calendar integration
            log_info(f"[INTEGRATION] Creating calendar event: {title} at {start_time}")
            
            # Simulate calendar event creation
            log_info(f"[INTEGRATION] Calendar event created successfully")
            return True
            
        except Exception as e:
            log_error(f"[INTEGRATION] Failed to create calendar event: {str(e)}", exc_info=True)
            
            # Create integration alert
            alert = Alert(
                type=AlertType.INTEGRATION,
                severity=AlertSeverity.WARNING,
                message=f"Failed to create calendar event: {title}",
                details=f"Error: {str(e)}"
            )
            self.db.add(alert)
            self.db.commit()
            
            return False
    
    def trigger_webhook(self, event_type: str, payload: dict) -> bool:
        """
        Trigger webhook for external integrations.
        
        Returns:
            True if triggered successfully, False otherwise
        """
        try:
            # TODO: Implement actual webhook integration
            log_info(f"[INTEGRATION] Triggering webhook: {event_type}")
            
            # Simulate webhook trigger
            log_info(f"[INTEGRATION] Webhook triggered successfully")
            return True
            
        except Exception as e:
            log_error(f"[INTEGRATION] Failed to trigger webhook: {str(e)}", exc_info=True)
            
            # Create integration alert
            alert = Alert(
                type=AlertType.INTEGRATION,
                severity=AlertSeverity.WARNING,
                message=f"Failed to trigger webhook: {event_type}",
                details=f"Error: {str(e)}"
            )
            self.db.add(alert)
            self.db.commit()
            
            return False
