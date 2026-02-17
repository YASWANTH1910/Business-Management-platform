# CareOps Backend API

Production-ready FastAPI backend for the CareOps unified business operations platform.

## Tech Stack

- **Python 3.11+**
- **FastAPI** - Modern web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **Alembic** - Database migrations
- **JWT** - Authentication
- **Pydantic** - Data validation

## Architecture Principles

✅ **Event-based** - All automation triggered explicitly  
✅ **Predictable** - No hidden logic or silent operations  
✅ **Strict** - Type-safe with Pydantic validation  
✅ **Fault tolerant** - Integration failures don't break core flow  
✅ **Scalable** - Connection pooling, pagination, indexes  
✅ **Clean structure** - Separation of concerns (models, schemas, services, routes)

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── core/                # Core configuration
│   │   ├── config.py        # Environment settings
│   │   ├── database.py      # SQLAlchemy setup
│   │   ├── security.py      # JWT & password hashing
│   │   └── logger.py        # Logging configuration
│   ├── models/              # SQLAlchemy models
│   │   ├── user.py
│   │   ├── contact.py
│   │   ├── booking.py
│   │   ├── inventory.py
│   │   ├── alert.py
│   │   └── message.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── user_schema.py
│   │   ├── contact_schema.py
│   │   ├── booking_schema.py
│   │   ├── inventory_schema.py
│   │   ├── alert_schema.py
│   │   └── message_schema.py
│   ├── services/            # Business logic
│   │   ├── booking_service.py
│   │   ├── automation_service.py
│   │   ├── inventory_service.py
│   │   ├── integration_service.py
│   │   └── alert_service.py
│   ├── routes/              # API endpoints
│   │   ├── auth.py
│   │   ├── contacts.py
│   │   ├── bookings.py
│   │   ├── inventory.py
│   │   ├── alerts.py
│   │   ├── messages.py
│   │   └── dashboard.py
│   └── dependencies/        # Dependency injection
│       └── auth_dependency.py
├── alembic/                 # Database migrations
├── requirements.txt
├── .env.example
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/careops_db
SECRET_KEY=your-secret-key-here
```

### 3. Setup PostgreSQL Database

```bash
# Create database
createdb careops_db

# Or using psql
psql -U postgres
CREATE DATABASE careops_db;
```

### 4. Run Database Migrations

```bash
# Initialize Alembic (first time only)
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: `http://localhost:8000`  
API docs: `http://localhost:8000/docs`

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Dashboard
- `GET /dashboard` - Get business metrics

### Contacts
- `POST /contacts` - Create contact (triggers welcome message)
- `GET /contacts` - List contacts
- `GET /contacts/{id}` - Get contact
- `PATCH /contacts/{id}` - Update contact
- `DELETE /contacts/{id}` - Delete contact (admin only)

### Bookings
- `POST /bookings` - Create booking (triggers confirmation)
- `GET /bookings` - List bookings
- `GET /bookings/{id}` - Get booking
- `PATCH /bookings/{id}` - Update booking
- `POST /bookings/{id}/send-reminder` - Send reminder
- `POST /bookings/{id}/send-form-reminder` - Send form reminder

### Inventory
- `POST /inventory` - Create inventory item
- `GET /inventory` - List inventory
- `GET /inventory/low-stock` - Get low stock items
- `GET /inventory/{id}` - Get inventory item
- `PATCH /inventory/{id}` - Update inventory (triggers alert if low)

### Alerts
- `GET /alerts` - List alerts
- `GET /alerts/count` - Get active alert count
- `GET /alerts/{id}` - Get alert
- `PATCH /alerts/{id}/dismiss` - Dismiss alert

### Messages
- `POST /messages` - Create message
- `GET /messages` - List all messages
- `GET /messages/{contact_id}` - Get messages for contact

## Event-Based Automation

All automation is **explicitly triggered** from the service layer:

### 1. New Contact → Welcome Message
```python
# In contacts route
automation = AutomationService(db)
automation.handle_new_contact(contact)
```

### 2. Booking Created → Confirmation
```python
# In booking_service.create_booking()
self.automation.handle_booking_created(booking)
```

### 3. Inventory Low → Alert
```python
# In inventory_service.update_inventory()
self._check_and_create_alert(inventory)
```

### 4. Staff Reply → Automation Stops
```python
# Checked in automation_service
if self.should_stop_automation(contact_id):
    return  # Don't send automated messages
```

## Role-Based Access Control

### Admin
- Full access to all endpoints
- Can delete contacts
- Can modify system settings

### Staff
- Can manage bookings
- Can reply to messages
- Can view inventory
- **Cannot** modify system logic
- **Cannot** delete contacts

## Integration Fault Tolerance

**CRITICAL DESIGN PRINCIPLE**: Integration failures NEVER break core business flow.

```python
# Example: Email sending
success = integration.send_email(...)
if not success:
    # Email failed, but booking is still created
    # Alert is logged for admin
    # Core flow continues
```

All integration failures:
- Are logged
- Create alerts
- Return status (don't raise exceptions)
- Don't prevent core operations

## Database Migrations

### Create Migration
```bash
alembic revision --autogenerate -m "Description of changes"
```

### Apply Migrations
```bash
alembic upgrade head
```

### Rollback Migration
```bash
alembic downgrade -1
```

### View Migration History
```bash
alembic history
```

## Deployment

### Environment Variables (Production)
```env
ENVIRONMENT=production
DATABASE_URL=postgresql://...
SECRET_KEY=<strong-secret-key>
ALLOWED_ORIGINS=https://yourdomain.com
```

### Deploy to Render/Railway

1. Connect GitHub repository
2. Set environment variables
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Run migrations: `alembic upgrade head`

### Production Checklist

- [ ] Set `ENVIRONMENT=production`
- [ ] Use strong `SECRET_KEY`
- [ ] Configure `ALLOWED_ORIGINS`
- [ ] Setup PostgreSQL database
- [ ] Run migrations
- [ ] Configure integration API keys
- [ ] Enable HTTPS
- [ ] Setup monitoring/logging

## Testing

### Manual Testing with cURL

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@careops.com","password":"admin123","role":"admin"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@careops.com","password":"admin123"}'

# Get dashboard (with token)
curl -X GET http://localhost:8000/dashboard \
  -H "Authorization: Bearer <your-token>"
```

## Key Features

✅ JWT authentication with role-based access  
✅ Event-based automation (explicit triggers only)  
✅ Fault-tolerant integrations  
✅ Comprehensive logging  
✅ Database migrations with Alembic  
✅ Connection pooling  
✅ Pagination on list endpoints  
✅ Global error handling  
✅ CORS configuration  
✅ Health check endpoint  
✅ Production-ready structure

## Support

For issues or questions, refer to the API documentation at `/docs` (development mode).
