# Budget Module API Reference

## 🔐 Authentication Required

All endpoints require JWT cookie authentication (login first at `/api/auth/sign-in`)

---

## 📋 Endpoints

### 1. Create Budget

**POST** `/api/budgets`

```json
{
  "category": "FOOD",
  "allocatedAmount": "1500.00",
  "startDate": "2026-03-01",
  "endDate": "2026-03-31",
  "description": "March food and dining budget",
  "isActive": true
}
```

**Categories:** `FOOD`, `TRANSPORT`, `ENTERTAINMENT`, `HEALTH`, `SHOPPING`, `OTHERS`

---

### 2. Get All Budgets

**GET** `/api/budgets?page=1&limit=10&category=FOOD`

**Query Parameters:**

- `page` (optional) - Page number, default: 1
- `limit` (optional) - Items per page, default: 10
- `category` (optional) - Filter by category

---

### 3. Get Budget Summary

**GET** `/api/budgets/summary`

Returns total allocated, total spent, remaining, and utilization percentage.

---

### 4. Get Single Budget

**GET** `/api/budgets/:id`

Example: `/api/budgets/15cb2315-5c72-49a3-a992-3aac90f2140c`

---

### 5. Update Budget

**PATCH** `/api/budgets/:id`

```json
{
  "allocatedAmount": "1800.00",
  "description": "Updated to include more dining out",
  "isActive": true
}
```

All fields are optional.

---

### 6. Delete Budget

**DELETE** `/api/budgets/:id`

Returns: `{ "success": true, "data": null, "message": "Budget deleted successfully" }`

---

## ✅ Test Results Summary

All endpoints tested and working:

- ✅ Create Budget: Returns 201 with budget data
- ✅ Get All Budgets: Returns paginated list with meta
- ✅ Get Summary: Returns financial statistics
- ✅ Get Single: Returns individual budget details
- ✅ Update Budget: Partial updates working
- ✅ Delete Budget: Soft delete successful

**Database:** Neon PostgreSQL  
**Base URL:** `http://localhost:3000/api`  
**Auth:** Cookie-based JWT (automatic after login)
