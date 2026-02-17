from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.dependencies.auth_dependency import get_current_user
from app.models.user import User
from app.schemas.inventory_schema import InventoryCreate, InventoryUpdate, InventoryResponse
from app.services.inventory_service import InventoryService

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.post("", response_model=InventoryResponse, status_code=status.HTTP_201_CREATED)
def create_inventory(
    inventory_data: InventoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new inventory item.
    
    EVENT TRIGGER: Creates alert if quantity is below threshold.
    """
    service = InventoryService(db)
    inventory = service.create_inventory(inventory_data)
    return InventoryResponse.model_validate(inventory)


@router.get("", response_model=List[InventoryResponse])
def get_inventory(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all inventory items with pagination."""
    service = InventoryService(db)
    items = service.get_all_inventory(skip=skip, limit=limit)
    return [InventoryResponse.model_validate(i) for i in items]


@router.get("/low-stock", response_model=List[InventoryResponse])
def get_low_stock(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all items with low stock."""
    service = InventoryService(db)
    items = service.get_low_stock_items()
    return [InventoryResponse.model_validate(i) for i in items]


@router.get("/{inventory_id}", response_model=InventoryResponse)
def get_inventory_item(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get inventory item by ID."""
    service = InventoryService(db)
    item = service.get_inventory(inventory_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Inventory item {inventory_id} not found"
        )
    return InventoryResponse.model_validate(item)


@router.patch("/{inventory_id}", response_model=InventoryResponse)
def update_inventory(
    inventory_id: int,
    inventory_data: InventoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update inventory item.
    
    EVENT TRIGGER: Creates alert if quantity drops below threshold.
    """
    service = InventoryService(db)
    try:
        item = service.update_inventory(inventory_id, inventory_data)
        return InventoryResponse.model_validate(item)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
