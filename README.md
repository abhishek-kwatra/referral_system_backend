# Multi-Level Referral and Earnings System (Backend)

This is the backend implementation for a real-time Multi-Level Referral and Earnings System. It allows users to register, make purchases, and earn referral-based commissions up to two levels. Real-time notifications and visualizations are also integrated.

---

## Features

- Multi-level referral structure
  - 5% commission for Level 1 (direct referrals)
  - 1% commission for Level 2 (indirect referrals)
- Purchase-based earnings (Only valid for purchases > ₹1000)
- Real-time earnings updates using Socket.IO
- RESTful API for user registration, purchases, earnings tracking, and referrals
- Validations for edge cases (e.g., max referrals, inactive users)
- Chart.js integration for earnings visualization on the frontend

---

##  Architecture

**Pattern Used:** MVC (Model-View-Controller)

- **Model** – Manages database schemas and connections
- **Controller** – Contains business logic (registration, purchase, earnings)
- **Routes** – Defines HTTP API endpoints
- **Middleware** – Handles authentication and logging
- **Server** – Express.js setup with WebSocket integration
- **Socket Layer** – Enables real-time communication

---

##  Database Design

### Tables:
- `Users`: User details, referrals, and active status
- `Purchases`: Tracks user purchases
- `Earnings`: Logs commission earnings per transaction

---

##  API Endpoints

###  User Management
- `POST /api/users/register` – Register a user (with or without referral)

###  Purchases
- `POST /api/purchases` – Submit a purchase and distribute earnings

###  Earnings
- `GET /api/earnings/:user_id` – Retrieve a user’s earnings summary

###  Referrals
- `GET /api/users/:user_id/referrals` – View Level 1 and Level 2 referrals

---

##  Real-Time Notifications

Implemented via **Socket.IO**:
- Register client: `socket.emit('register', userId)`
- Listen for earnings: `socket.on('new_earning', data)`
- Emits real-time earnings after qualified purchases

---

##  Chart Visualization (Frontend Integration)

Uses **Chart.js** for visual representation:
- Doughnut Chart – Earnings distribution by referral level
- Bar Chart – Earnings per referral

---

##  Validations & Constraints

- ✅ Only purchases above ₹1000 are eligible for referral commission
- ✅ A user can have **a maximum of 8 direct referrals**
- ❌ Inactive users do not earn commissions
- ❌ Invalid referral codes return appropriate error messages

---

##  Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/referral-system-backend.git
   cd referral-system-backend
