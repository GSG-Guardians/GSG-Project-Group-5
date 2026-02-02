# Debt Module API Reference

## 🔐 Authentication Required
All endpoints require JWT cookie authentication (login first at `/api/auth/sign-in`)

---

## 📋 Endpoints

### 0. Get Available Currencies (REQUIRED FIRST!)
**GET** `/api/currencies`

Returns all available currencies with their UUIDs. **You need a currency UUID to create debts!**

**Response:**
```json
[
  {
    "id": "4e9d2cf4-da28-4d7f-8148-bb6d04b3c7f8",
    "code": "USD",
    "symbol": "$",
    "name": "United States (US Dollar)"
  }
]
```

---

### 1. Create Debt
**POST** `/api/debts`

```json
{
  "personalName": "Michael Smith",
  "direction": "I_OWE",
  "amount": "850.00",
  "currencyId": "4e9d2cf4-da28-4d7f-8148-bb6d04b3c7f8",
  "dueDate": "2026-03-20",
  "description": "Borrowed for home renovation"
}
```

**Directions:** `I_OWE` (money you owe) | `OWED_TO_ME` (money owed to you)

---

### 2. Get All Debts
**GET** `/api/debts?page=1&limit=10&direction=I_OWE&status=UNPAID`

**Query Parameters:**
- `page` (optional) - Page number, default: 1
- `limit` (optional) - Items per page, default: 10
- `direction` (optional) - Filter: `I_OWE` or `OWED_TO_ME`
- `status` (optional) - Filter: `UNPAID`, `PAID`, `OVERDUE`

---

### 3. Get Debt Summary
**GET** `/api/debts/summary`

Returns: total owed to you, total you owe, net balance, unpaid count.

---

### 4. Get Single Debt
**GET** `/api/debts/:id`

Example: `/api/debts/72184f21-04e0-49e9-ad5a-1b72a9714d93`

---

### 5. Update Debt
**PATCH** `/api/debts/:id`

```json
{
  "status": "PAID",
  "description": "Paid back in full on Feb 2nd"
}
```

**Status values:** `UNPAID`, `PAID`, `OVERDUE`

All fields are optional.

---

### 6. Delete Debt
**DELETE** `/api/debts/:id`

Returns: `{ "success": true, "data": null, "message": "Debt deleted successfully" }`

---

## ✅ Test Results Summary

All endpoints tested and working:
- ✅ Get Currencies: Returns 7 currencies with UUIDs
- ✅ Create Debt: Returns 201 with debt data (includes reminder fields)
- ✅ Get All Debts: Returns paginated list (9 total debts)
- ✅ Get Summary: Returns financial overview (totalOwed, totalOwe, netBalance)
- ✅ Get Single: Returns individual debt details
- ✅ Update Debt: Status and description updates working
- ✅ Delete Debt: Soft delete successful

**Database:** Neon PostgreSQL  
**Base URL:** `http://localhost:3000/api`  
**Auth:** Cookie-based JWT (automatic after login)

---

## 💡 Quick Testing Flow

1. Login: `POST /api/auth/sign-in`
2. Get currencies: `GET /api/currencies` (copy a UUID)
3. Create debt: `POST /api/debts` (use the currency UUID)
4. View all: `GET /api/debts`
5. Update status: `PATCH /api/debts/:id` → `{ "status": "PAID" }`
6. Delete: `DELETE /api/debts/:id`
