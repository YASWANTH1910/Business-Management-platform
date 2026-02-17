from sqlalchemy.orm import Session
from datetime import datetime
from app.models.inventory import Inventory
from app.models.alert import Alert, AlertType, AlertSeverity
from app.schemas.inventory_schema import InventoryCreate, InventoryUpdate
from app.core.logger import log_info, log_warning


class InventoryService:
    """
    Inventory service with alert logic.
    
    Triggers alerts when inventory falls below threshold.
    Prevents duplicate alerts for the same low stock event.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_inventory(self, inventory_data: InventoryCreate) -> Inventory:
        """Create a new inventory item."""
        log_info(f"[SERVICE] Creating inventory item: {inventory_data.item_name}")
        
        inventory = Inventory(**inventory_data.model_dump())
        self.db.add(inventory)
        self.db.commit()
        self.db.refresh(inventory)
        
        # Check if low stock alert needed
        self._check_and_create_alert(inventory)
        
        return inventory
    
    def update_inventory(self, inventory_id: int, inventory_data: InventoryUpdate) -> Inventory:
        """
        Update inventory item.
        
        EVENT TRIGGER: Create alert if quantity drops below threshold
        """
        log_info(f"[SERVICE] Updating inventory {inventory_id}")
        
        inventory = self.db.query(Inventory).filter(Inventory.id == inventory_id).first()
        if not inventory:
            raise ValueError(f"Inventory {inventory_id} not found")
        
        # Track if quantity changed
        old_quantity = inventory.quantity
        
        # Update fields
        update_data = inventory_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(inventory, field, value)
        
        inventory.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(inventory)
        
        # Check if alert needed (only if quantity changed)
        if 'quantity' in update_data and inventory.quantity != old_quantity:
            self._check_and_create_alert(inventory)
        
        log_info(f"[SERVICE] Inventory updated: {inventory.id}")
        return inventory
    
    def get_inventory(self, inventory_id: int) -> Inventory:
        """Get inventory by ID."""
        return self.db.query(Inventory).filter(Inventory.id == inventory_id).first()
    
    def get_all_inventory(self, skip: int = 0, limit: int = 100) -> list[Inventory]:
        """Get all inventory items with pagination."""
        return self.db.query(Inventory).offset(skip).limit(limit).all()
    
    def get_low_stock_items(self) -> list[Inventory]:
        """Get all items with low stock."""
        return self.db.query(Inventory).filter(
            Inventory.quantity < Inventory.threshold
        ).all()
    
    def _check_and_create_alert(self, inventory: Inventory):
        """
        Check if inventory is low and create alert if needed.
        
        PREVENTS DUPLICATE ALERTS:
        - Only creates alert if no active alert exists for this item
        """
        if not inventory.is_low_stock:
            return
        
        log_warning(f"[SERVICE] Low stock detected for {inventory.item_name}: {inventory.quantity}/{inventory.threshold}")
        
        # Check if active alert already exists
        existing_alert = self.db.query(Alert).filter(
            Alert.type == AlertType.INVENTORY,
            Alert.reference_type == "inventory",
            Alert.reference_id == inventory.id,
            Alert.is_dismissed == False
        ).first()
        
        if existing_alert:
            log_info(f"[SERVICE] Active alert already exists for {inventory.item_name}, skipping")
            return
        
        # Create new alert
        alert = Alert(
            type=AlertType.INVENTORY,
            severity=AlertSeverity.WARNING if inventory.quantity > 0 else AlertSeverity.CRITICAL,
            message=f"Low stock: {inventory.item_name}",
            details=f"Current quantity: {inventory.quantity}, Threshold: {inventory.threshold}",
            reference_type="inventory",
            reference_id=inventory.id
        )
        
        self.db.add(alert)
        self.db.commit()
        
        log_info(f"[SERVICE] Low stock alert created for {inventory.item_name}")
