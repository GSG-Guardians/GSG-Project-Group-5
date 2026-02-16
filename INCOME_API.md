# Income API Endpoints Documentation

All endpoints require authentication (JWT Cookie/Bearer Token).

**Base Path:** `/incomes`

## 1. Create Income (Add Income)

- **Method:** `POST`
- **Path:** `/incomes`
- **Purpose:** Add a new income record.
- **Request Body (JSON):**

```json
{
  "amount": 5000,
  "currencyId": "UUID-of-currency",
  "source": "SALARY",
  "incomeDate": "2024-02-14",
  "frequency": "MONTHLY",
  "description": "Monthly Salary",
  "assetId": "UUID-of-asset",
  "endAt": "2025-02-14",
  "isRecurringActive": true
}
```

### Enum Values:

- **Source:** `SALARY`, `FREELANCE`, `BUSINESS`, `INVESTMENT`, `BONUS`, `GIFT`, `OTHER`
- **Frequency:** `ONE_TIME`, `DAILY`, `WEEKLY`, `MONTHLY`, `YEARLY`

---

## 2. Get All Incomes

- **Method:** `GET`
- **Path:** `/incomes`
- **Purpose:** Retrieve all income records with pagination and filtering.
- **Query Params:** `page`, `limit`, `source`, `startDate`, `endDate`.

## 3. Get Income Summary

- **Method:** `GET`
- **Path:** `/incomes/summary`
- **Purpose:** Get total income summary.

## 4. Get Recent Incomes

- **Method:** `GET`
- **Path:** `/incomes/recent`
- **Purpose:** Get the most recent income entries.

## 5. Get Income Breakdown

- **Method:** `GET`
- **Path:** `/incomes/breakdown`
- **Query Params:** `period` (e.g., `last7days`, `last30days`, `thisMonth`, `lastMonth`, `thisYear`)
- **Purpose:** Get income breakdown by source for a specific period.

## 6. Get Income Chart Data

- **Method:** `GET`
- **Path:** `/incomes/chart`
- **Query Params:** `period`
- **Purpose:** Get data formatted for charts.

## 7. Get Income By ID

- **Method:** `GET`
- **Path:** `/incomes/:id`
- **Purpose:** Retrieve details of a specific income record.

## 8. Update Income

- **Method:** `PATCH`
- **Path:** `/incomes/:id`
- **Purpose:** Update an existing income record.
- **Request Body:** Partial update supported (same fields as Create).

## 9. Delete Income

- **Method:** `DELETE`
- **Path:** `/incomes/:id`
- **Purpose:** Remove an income record.
