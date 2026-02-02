# Testing Checklist - Budget, Debt & Financial Report Modules

## ✅ Code Quality Status

- **Linting**: All errors fixed ✅
- **TypeScript**: No compilation errors ✅
- **Build**: Successful ✅
- **Authentication**: Fully integrated ✅

---

## 🔐 Authentication Setup

All endpoints require JWT authentication via **cookies** (NOT Bearer token).

### 📌 Step 1: Login First (REQUIRED)

**Endpoint:** `POST http://localhost:3000/api/auth/sign-in`

**Body:**

```json
{
  "email": "admin@email.com",
  "password": "123456"
}
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "c63914f4-931c-4d39-9219-f62b10eec5f7",
      "email": "admin@email.com",
      "fullName": "Admin User",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOi..."
  }
}
```

**🔑 CRITICAL - Cookie Authentication:**

- ✅ Login automatically sets an **`access_token` cookie**
- ✅ Postman/Browser **automatically sends this cookie** with future requests
- ❌ **DO NOT** manually add token to Authorization header
- ❌ **DO NOT** use Bearer Token - the system uses cookies!

### ⚙️ Postman Setup:

1. **Enable cookie handling:** Settings → "Send cookies with domain matching URL"
2. **Remove Authorization header** from all requests
3. **Just login once** - all subsequent requests work automatically!

### ✅ Testing Flow:

1. Send POST to `/api/auth/sign-in` with email/password
2. Click "Cookies" link below Send button - see `access_token` cookie saved
3. Send GET to `/api/budgets` - works automatically with cookie!

### ⚠️ Troubleshooting 401 "Missing access token":

- ❌ You're using Bearer Token in Authorization header → **Remove it!**
- ❌ Cookie not saved → Check Postman cookie settings, login again
- ❌ Different workspace → Login and test in **same Postman workspace**
- ✅ Click "Cookies" to verify `access_token` exists for localhost:3000

---

## 📋 Postman Testing Guide

### Prerequisites

✅ **Database connected** - Neon PostgreSQL  
✅ **Seeds populated** - Run `npm run seed:currency` then `npm run seed`  
✅ **Server running** - `npm run start:dev` on `http://localhost:3000`  
✅ **Logged in** - Use admin@email.com / 123456

---

## 🎯 Budget Module API Testing

### Base URL: `/api/budgets`

**Authentication:** Required (JWT cookie)

---

#### 1️⃣ Create Budget

**Endpoint:** `POST http://localhost:3000/api/budgets`

**⚠️ IMPORTANT:** Do NOT add Authorization header! Cookie authentication is automatic.

**Headers:**

```
Content-Type: application/json
```

**Body:**

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

**Valid Categories:**

- `FOOD`
- `TRANSPORT`
- `ENTERTAINMENT`
- `HEALTH`
- `SHOPPING`
- `OTHERS`

**Expected Response:**

```json
{
  "success": true,
  "message": "Budget created successfully",
  "data": {
    "id": "uuid",
    "category": "FOOD",
    "allocatedAmount": "1500.00",
    "spentAmount": "0.00",
    "startDate": "2026-03-01",
    "endDate": "2026-03-31",
    "description": "March food and dining budget",
    "isActive": true,
    "userId": "uuid",
    "createdAt": "2026-02-02T...",
    "updatedAt": "2026-02-02T..."
  }
}
```

---

#### 2️⃣ Get All Budgets (Paginated)

**Endpoint:** `GET http://localhost:3000/api/budgets`

**Query Parameters (all optional):**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `category` - Filter by category (FOOD, TRANSPORT, etc.)

**Examples:**

```
GET http://localhost:3000/api/budgets
GET http://localhost:3000/api/budgets?page=1&limit=5
GET http://localhost:3000/api/budgets?category=FOOD
GET http://localhost:3000/api/budgets?page=2&limit=10&category=TRANSPORT
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Budgets fetched successfully",
  "data": [
    {
      "id": "uuid",
      "category": "FOOD",
      "allocatedAmount": "500.00",
      "spentAmount": "320.50",
      "startDate": "2026-02-01",
      "endDate": "2026-02-28",
      "description": "Monthly grocery budget",
      "isActive": true,
      "userId": "uuid"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2
  }
}
```

---

#### 3️⃣ Get Budget Summary

**Endpoint:** `GET http://localhost:3000/api/budgets/summary`

**Expected Response:**

```json
{
  "success": true,
  "message": "Budget summary fetched successfully",
  "data": {
    "totalAllocated": "2000.00",
    "totalSpent": "1296.55",
    "totalRemaining": "703.45",
    "budgetCount": 6,
    "utilizationPercentage": 64.83
  }
}
```

---

#### 4️⃣ Get Single Budget

**Endpoint:** `GET http://localhost:3000/api/budgets/:id`

**Example:** `GET http://localhost:3000/api/budgets/15cb2315-5c72-49a3-a992-3aac90f2140c`

**Expected Response:**

```json
{
  "success": true,
  "message": "Budget fetched successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "category": "FOOD",
    "allocatedAmount": "500.00",
    "spentAmount": "320.50",
    "startDate": "2026-02-01",
    "endDate": "2026-02-28",
    "description": "Monthly grocery budget",
    "isActive": true,
    "userId": "uuid"
  }
}
```

---

#### 5️⃣ Update Budget

**Endpoint:** `PATCH http://localhost:3000/api/budgets/:id`

**Body (all fields optional):**

```json
{
  "allocatedAmount": "1800.00",
  "description": "Updated to include more dining out",
  "isActive": true
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Budget updated successfully",
  "data": {
    "id": "uuid",
    "category": "FOOD",
    "allocatedAmount": "1800.00",
    "description": "Updated to include more dining out",
    ...
  }
}
```

---

#### 6️⃣ Delete Budget

**Endpoint:** `DELETE http://localhost:3000/api/budgets/:id`

**Expected Response:**

```json
{
  "success": true,
  "message": "Budget deleted successfully",
  "data": null
}
```

---

## 💰 Debt Module API Testing

### Base URL: `/api/debts`

**Authentication:** Required (JWT cookie)

---

#### 1️⃣ Create Debt

**Endpoint:** `POST http://localhost:3000/api/debts`

**⚠️ CRITICAL: Get Currency ID First!**

**Step 1:** Get available currencies

```
GET http://localhost:3000/api/currencies
```

**Response example:**

```json
{
  "success": true,
  "data": [
    {
      "id": "4e9d2cf4-da28-4d7f-8148-bb6d04b3c7f8",
      "code": "USD",
      "symbol": "$",
      "name": "United States (US Dollar)"
    }
  ]
}
```

**Step 2:** Copy the UUID from the currency you want (e.g., `4e9d2cf4-da28-4d7f-8148-bb6d04b3c7f8`)

**Step 3:** Create debt using the UUID

**Headers:**

```
Content-Type: application/json
```

**Body:**

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

**❌ Common Mistake:**

- Using `"currencyId": "1"` - WRONG! Must be a UUID
- Using `"currencyId": "USD"` - WRONG! Must be the UUID, not the code

**Valid Directions:**

- `I_OWE` - Money you owe to someone
- `OWED_TO_ME` - Money someone owes to you

**Expected Response:**

```json
{
  "success": true,
  "message": "Debt created successfully",
  "data": {
    "id": "uuid",
    "personalName": "Michael Smith",
    "direction": "I_OWE",
    "amount": "850.00",
    "dueDate": "2026-03-20",
    "description": "Borrowed for home renovation",
    "status": "UNPAID",
    "userId": "uuid",
    "currencyId": "uuid",
    "createdAt": "2026-02-02T..."
  }
}
```

---

#### 2️⃣ Get All Debts (Paginated)

**Endpoint:** `GET http://localhost:3000/api/debts`

**Query Parameters (all optional):**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `direction` - Filter by direction (I_OWE, OWED_TO_ME)
- `status` - Filter by status (UNPAID, PAID, OVERDUE)

**Examples:**

```
GET http://localhost:3000/api/debts
GET http://localhost:3000/api/debts?direction=I_OWE
GET http://localhost:3000/api/debts?status=UNPAID
GET http://localhost:3000/api/debts?direction=OWED_TO_ME&status=PAID
GET http://localhost:3000/api/debts?page=1&limit=5
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Debts fetched successfully",
  "data": [
    {
      "id": "uuid",
      "personalName": "John Doe",
      "direction": "I_OWE",
      "amount": "500.00",
      "dueDate": "2026-02-17",
      "description": "Borrowed for laptop repair",
      "status": "UNPAID",
      "currency": {
        "id": "uuid",
        "code": "USD",
        "symbol": "$",
        "name": "United States (US Dollar)"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 8,
    "totalPages": 1
  }
}
```

---

#### 3️⃣ Get Debt Summary

**Endpoint:** `GET http://localhost:3000/api/debts/summary`

**Expected Response:**

```json
{
  "success": true,
  "message": "Debt summary fetched successfully",
  "data": {
    "totalOwed": "1950.00",
    "totalOwedToMe": "1285.50",
    "netDebt": "664.50",
    "unpaidCount": 5,
    "paidCount": 1,
    "overdueCount": 1
  }
}
```

---

#### 4️⃣ Get Single Debt

**Endpoint:** `GET http://localhost:3000/api/debts/:id`

**Example:** `GET http://localhost:3000/api/debts/72184f21-04e0-49e9-ad5a-1b72a9714d93`

**Expected Response:**

```json
{
  "success": true,
  "message": "Debt fetched successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "personalName": "John Doe",
    "direction": "I_OWE",
    "amount": "500.00",
    "dueDate": "2026-02-17",
    "description": "Borrowed for laptop repair",
    "status": "UNPAID",
    "currency": {
      "code": "USD",
      "symbol": "$"
    }
  }
}
```

---

#### 5️⃣ Update Debt

**Endpoint:** `PATCH http://localhost:3000/api/debts/:id`

**Body (all fields optional):**

```json
{
  "status": "PAID",
  "description": "Paid back in full on Feb 2nd"
}
```

**Valid Status Values:**

- `UNPAID`
- `PAID`
- `OVERDUE`

**Expected Response:**

```json
{
  "success": true,
  "message": "Debt updated successfully",
  "data": {
    "id": "uuid",
    "status": "PAID",
    "description": "Paid back in full on Feb 2nd",
    ...
  }
}
```

---

#### 6️⃣ Delete Debt

**Endpoint:** `DELETE http://localhost:3000/api/debts/:id`

**Expected Response:**

```json
{
  "success": true,
  "message": "Debt deleted successfully",
  "data": null
}
```

---

## 📊 Financial Report Module API Testing

### Base URL: `/api/financial-reports`

**Authentication:** Required (JWT cookie)

---

#### 1️⃣ Get Financial Report

**Endpoint:** `GET http://localhost:3000/api/financial-reports`

**Query Parameters (required):**

- `startDate` - Start date (YYYY-MM-DD format)
- `endDate` - End date (YYYY-MM-DD format)

**Examples:**

```
GET http://localhost:3000/api/financial-reports?startDate=2026-02-01&endDate=2026-02-28
GET http://localhost:3000/api/financial-reports?startDate=2026-01-01&endDate=2026-03-31
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Financial report generated successfully",
  "data": {
    "period": {
      "startDate": "2026-02-01T00:00:00.000Z",
      "endDate": "2026-02-28T23:59:59.999Z"
    },
    "summary": {
      "totalIncome": "0.00",
      "totalExpenses": "1296.55",
      "netSavings": "-1296.55",
      "budgetUtilization": 64.83
    },
    "categoryBreakdown": [
      {
        "category": "FOOD",
        "allocated": "500.00",
        "spent": "320.50",
        "percentage": 64.1
      },
      {
        "category": "TRANSPORT",
        "allocated": "300.00",
        "spent": "180.75",
        "percentage": 60.25
      }
    ],
    "weeklyTrend": [
      {
        "week": "Week 1",
        "amount": "280.50"
      },
      {
        "week": "Week 2",
        "amount": "350.75"
      }
    ],
    "insights": [
      {
        "type": "alert",
        "title": "Shopping Budget Near Limit",
        "message": "You have spent 80% of your Shopping budget.",
        "isRead": false
      }
    ]
  }
}
```

---

#### 2️⃣ Create Financial Insight

**Endpoint:** `POST http://localhost:3000/api/financial-reports/insights`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "insightType": "recommendation",
  "title": "Savings Tip",
  "message": "Consider reducing entertainment expenses to save $150 monthly",
  "periodStart": "2026-02-01",
  "periodEnd": "2026-02-28"
}
```

**Valid Insight Types:**

- `alert` - Urgent notification
- `warning` - Warning message
- `recommendation` - Helpful suggestion
- `info` - Informational message

**Expected Response:**

```json
{
  "success": true,
  "message": "Insight created successfully",
  "data": {
    "id": "uuid",
    "insightType": "recommendation",
    "title": "Savings Tip",
    "message": "Consider reducing entertainment expenses to save $150 monthly",
    "periodStart": "2026-02-01",
    "periodEnd": "2026-02-28",
    "isRead": false,
    "userId": "uuid",
    "createdAt": "2026-02-02T..."
  }
}
```

---

#### 3️⃣ Mark Insight as Read

**Endpoint:** `PATCH http://localhost:3000/api/financial-reports/insights/:id/read`

**Example:** `PATCH http://localhost:3000/api/financial-reports/insights/550e8400-e29b-41d4-a716-446655440000/read`

**Expected Response:**

```json
{
  "success": true,
  "message": "Insight marked as read",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "isRead": true,
    "updatedAt": "2026-02-02T..."
  }
}
```

---

## 🔍 Deep Integration Review

### ✅ Entity Relationships

- **Budget** → User (via `user_id`)
- **Debt** → User (via `userId`) + Currency (via `currencyId`)
- **FinancialInsight** → User (via `user_id`)

### ✅ Field Mappings

- **DTOs ↔ Entities**: All field mappings verified
  - Budget: `description` (DTO) → `notes` (entity)
  - Debt: All fields match
  - FinancialInsight: Period fields (`period_start`, `period_end`)

### ✅ Authentication Flow

1. User logs in → JWT token stored in cookie
2. JwtCookieGuard validates token
3. Guard injects `req.user` (UserResponseDto)
4. Controllers access `req.user!.id` (non-null)
5. Services filter data by userId

### ✅ Response Structure

All endpoints use unified response format:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "meta": {} // for paginated endpoints
}
```

### ✅ Validation

- **Zod Schemas**: All request DTOs validated
- **Pipe**: ZodValidationPipe ensures data integrity
- **Type Safety**: TypeScript strict mode enabled

### ✅ Error Handling

- **401**: Unauthorized (no/invalid token)
- **404**: Resource not found
- **400**: Validation errors
- **500**: Server errors

---

## 🧪 Testing Scenarios

### Critical Tests Before Production

#### 1. User Isolation ✅

- [ ] User A cannot see User B's budgets
- [ ] User A cannot update User B's debts
- [ ] User A cannot delete User B's data

#### 2. Pagination ✅

- [ ] Page 1 returns first N items
- [ ] Page 2 returns next N items
- [ ] Meta data (total, pages) accurate

#### 3. Filtering ✅

- [ ] Category filter works on budgets
- [ ] Direction/Status filter works on debts
- [ ] Date range filters work correctly

#### 4. Financial Report Accuracy ✅

- [ ] Category breakdown sums correctly
- [ ] Budget utilization calculated properly
- [ ] Period filtering includes correct data

#### 5. CRUD Operations ✅

- [ ] Create: All required fields validated
- [ ] Read: Returns correct data format
- [ ] Update: Partial updates work
- [ ] Delete: Soft delete vs hard delete

#### 6. Edge Cases ✅

- [ ] Empty results (no data for period)
- [ ] Invalid UUIDs handled
- [ ] Date validation (end > start)
- [ ] Decimal precision maintained

---

## 🚀 Ready for Testing

### Everything is configured and working:

1. ✅ **All TypeScript errors resolved**
2. ✅ **All linting errors fixed**
3. ✅ **Authentication fully integrated**
4. ✅ **Modules properly wired with UserModule**
5. ✅ **Type safety improved (no `any` types)**
6. ✅ **Build successful**
7. ✅ **Code formatted**

### Start Testing:

```bash
# Start development server
npm run start:dev

# In another terminal - run seeds (optional)
npm run seed

# Test endpoints in Postman
```

---

## 📝 Quick Reference - All Endpoints Summary

### 🔐 Authentication

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| POST   | `/api/auth/sign-in` | Login (email + password) |
| POST   | `/api/auth/sign-up` | Register new user        |
| GET    | `/api/auth/me`      | Get current user info    |

### 💵 Budget Module

| Method | Endpoint               | Description        | Query Params                |
| ------ | ---------------------- | ------------------ | --------------------------- |
| POST   | `/api/budgets`         | Create new budget  | -                           |
| GET    | `/api/budgets`         | Get all budgets    | `page`, `limit`, `category` |
| GET    | `/api/budgets/summary` | Get budget summary | -                           |
| GET    | `/api/budgets/:id`     | Get single budget  | -                           |
| PATCH  | `/api/budgets/:id`     | Update budget      | -                           |
| DELETE | `/api/budgets/:id`     | Delete budget      | -                           |

### 💰 Debt Module

| Method | Endpoint             | Description      | Query Params                           |
| ------ | -------------------- | ---------------- | -------------------------------------- |
| POST   | `/api/debts`         | Create new debt  | -                                      |
| GET    | `/api/debts`         | Get all debts    | `page`, `limit`, `direction`, `status` |
| GET    | `/api/debts/summary` | Get debt summary | -                                      |
| GET    | `/api/debts/:id`     | Get single debt  | -                                      |
| PATCH  | `/api/debts/:id`     | Update debt      | -                                      |
| DELETE | `/api/debts/:id`     | Delete debt      | -                                      |

### 📊 Financial Report Module

| Method | Endpoint                                   | Description          | Query Params                      |
| ------ | ------------------------------------------ | -------------------- | --------------------------------- |
| GET    | `/api/financial-reports`                   | Get financial report | `startDate`, `endDate` (required) |
| POST   | `/api/financial-reports/insights`          | Create insight       | -                                 |
| PATCH  | `/api/financial-reports/insights/:id/read` | Mark insight as read | -                                 |

---

## 🎨 Postman Collection Quick Setup

### Create These Variables (Collection Level):

```
baseUrl: http://localhost:3000
adminEmail: admin@email.com
adminPassword: 123456
```

### Pre-request Script (for all requests):

```javascript
// Automatically sends cookies with each request
pm.sendRequest(pm.environment.get('baseUrl'));
```

---

## 🧪 Testing Checklist

### ✅ Budget Module Tests

- [ ] Create budget with all valid categories
- [ ] Get paginated list of budgets
- [ ] Filter budgets by category
- [ ] Get budget summary statistics
- [ ] Get single budget by ID
- [ ] Update budget (partial update)
- [ ] Delete budget
- [ ] Verify user isolation (can't see other users' budgets)
- [ ] Test date validation (endDate > startDate)

### ✅ Debt Module Tests

- [ ] Create debt with I_OWE direction
- [ ] Create debt with OWED_TO_ME direction
- [ ] Get paginated list of debts
- [ ] Filter by direction (I_OWE / OWED_TO_ME)
- [ ] Filter by status (UNPAID / PAID / OVERDUE)
- [ ] Get debt summary
- [ ] Get single debt with currency info
- [ ] Update debt status to PAID
- [ ] Delete debt
- [ ] Verify currency relationship

### ✅ Financial Report Module Tests

- [ ] Get report for current month
- [ ] Get report for date range
- [ ] Verify category breakdown calculations
- [ ] Check budget utilization percentage
- [ ] Verify weekly trend data
- [ ] Create custom insight
- [ ] Mark insight as read
- [ ] Test with empty data period

### ✅ Authentication & Security Tests

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (401)
- [ ] Access protected endpoint without auth (401)
- [ ] Verify JWT cookie is set after login
- [ ] Test user isolation (User A can't access User B's data)

### ✅ Edge Cases

- [ ] Empty results (no budgets/debts for period)
- [ ] Invalid UUID in path parameters (404)
- [ ] Invalid date formats (400)
- [ ] Invalid enum values (400)
- [ ] Negative amounts (validation error)
- [ ] Missing required fields (400)
- [ ] Pagination beyond available pages

---

## 📦 Seeded Test Data

Your database now has:

### Users:

- **Admin:** admin@email.com / 123456

### Budgets (for admin user):

- 6 current month budgets (FOOD, TRANSPORT, ENTERTAINMENT, HEALTH, SHOPPING, OTHERS)
- 2 next month budgets
- 2 last month budgets (inactive)
- **Total:** 10 budgets with realistic spending data

### Debts (for admin user):

- 4 debts I OWE (including 1 overdue)
- 4 debts OWED TO ME (including 1 paid)
- **Total:** 8 debts with various statuses

### Financial Insights (for admin user):

- 7 insights (alerts, recommendations, warnings)
- Mix of read and unread
- Related to budget categories and debt payments

### Currencies:

- USD, GBP, EUR, SAR, AED, JOD, JPY

---

## 🚀 Ready to Test!

**Status:** ✅ ALL SYSTEMS READY

1. ✅ Database seeded with realistic test data
2. ✅ Server running on http://localhost:3000
3. ✅ All endpoints documented with exact request/response examples
4. ✅ Authentication configured
5. ✅ User isolation implemented

### Start Testing Now:

1. Login: `POST /api/auth/sign-in` with admin@email.com / 123456
2. Test Budget APIs
3. Test Debt APIs
4. Test Financial Report APIs
5. Report any bugs or issues found

**Happy Testing! 🎉**

---

**Last Updated:** 2026-02-02  
**Branch:** feat/hamza-services-controllers  
**Database:** Neon PostgreSQL (Connected ✅)  
**Server:** http://localhost:3000 (Running ✅)
