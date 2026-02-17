from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.database import Base


class Inventory(Base):
    """
    Inventory model for tracking stock levels.
    
    Alert trigger:
    - When quantity < threshold: Create alert (via inventory_service)
    """
    __tablename__ = "inventory"
    
    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String(255), nullable=False, unique=True, index=True)
    quantity = Column(Integer, nullable=False, default=0)
    threshold = Column(Integer, nullable=False, default=10)
    unit = Column(String(50), nullable=True)
    notes = Column(String(500), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Inventory(id={self.id}, item_name={self.item_name}, quantity={self.quantity}, threshold={self.threshold})>"
    
    @property
    def is_low_stock(self) -> bool:
        """Check if inventory is below threshold."""
        return self.quantity < self.threshold
