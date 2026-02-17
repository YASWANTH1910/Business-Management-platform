from sqlalchemy.orm import Session
from datetime import datetime
from app.models.alert import Alert, AlertType, AlertSeverity
from app.schemas.alert_schema import AlertCreate
from app.core.logger import log_info


class AlertService:
    """
    Alert service for managing system notifications.
    
    Alerts are never deleted, only dismissed.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_alert(self, alert_data: AlertCreate) -> Alert:
        """Create a new alert."""
        log_info(f"[SERVICE] Creating alert: {alert_data.type} - {alert_data.message}")
        
        alert = Alert(**alert_data.model_dump())
        self.db.add(alert)
        self.db.commit()
        self.db.refresh(alert)
        
        return alert
    
    def dismiss_alert(self, alert_id: int) -> Alert:
        """Dismiss an alert (doesn't delete it)."""
        log_info(f"[SERVICE] Dismissing alert {alert_id}")
        
        alert = self.db.query(Alert).filter(Alert.id == alert_id).first()
        if not alert:
            raise ValueError(f"Alert {alert_id} not found")
        
        alert.is_dismissed = True
        alert.dismissed_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(alert)
        
        return alert
    
    def get_alert(self, alert_id: int) -> Alert:
        """Get alert by ID."""
        return self.db.query(Alert).filter(Alert.id == alert_id).first()
    
    def get_alerts(
        self,
        skip: int = 0,
        limit: int = 100,
        include_dismissed: bool = False,
        alert_type: AlertType = None,
        severity: AlertSeverity = None
    ) -> list[Alert]:
        """Get alerts with pagination and filters."""
        query = self.db.query(Alert)
        
        if not include_dismissed:
            query = query.filter(Alert.is_dismissed == False)
        
        if alert_type:
            query = query.filter(Alert.type == alert_type)
        
        if severity:
            query = query.filter(Alert.severity == severity)
        
        return query.order_by(Alert.created_at.desc()).offset(skip).limit(limit).all()
    
    def get_active_alert_count(self) -> int:
        """Get count of active (non-dismissed) alerts."""
        return self.db.query(Alert).filter(Alert.is_dismissed == False).count()
