# Financial Report Module API Reference

## 🔐 Authentication Required
All endpoints require JWT cookie authentication (login first at `/api/auth/sign-in`)

---

## 📋 Endpoints

### 1. Get Financial Report
**GET** `/api/financial-reports?startDate=2026-02-01&endDate=2026-02-28`

**Query Parameters (REQUIRED):**
- `startDate` - Start date in YYYY-MM-DD format
- `endDate` - End date in YYYY-MM-DD format

**Response:**
```json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2026-02-01T00:00:00.000Z",
      "endDate": "2026-02-28T00:00:00.000Z"
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
      }
    ],
    "weeklyTrend": [
      {
        "week": "Week 1",
        "amount": "0.00"
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

**Report Includes:**
- Period summary with income/expenses/savings
- Budget utilization percentage
- Category-wise spending breakdown
- Weekly spending trends
- Automatic insights (alerts, warnings, recommendations)

---

### 2. Create Financial Insight
**POST** `/api/financial-reports/insights`

```json
{
  "insightType": "recommendation",
  "title": "Savings Tip",
  "message": "Consider reducing entertainment expenses to save $150 monthly",
  "periodStart": "2026-02-01",
  "periodEnd": "2026-02-28"
}
```

**Insight Types:** `alert`, `warning`, `recommendation`, `info`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ce603a25-c86a-4715-b524-0e05a14ca451",
    "insight_type": "recommendation",
    "title": "Savings Tip",
    "message": "Consider reducing entertainment expenses to save $150 monthly",
    "period_start": "2026-02-01",
    "period_end": "2026-02-28",
    "is_read": false,
    "user_id": "uuid",
    "createdAt": "2026-02-02T13:49:14.324Z",
    "updatedAt": "2026-02-02T13:49:14.324Z"
  }
}
```

---

### 3. Mark Insight as Read
**PATCH** `/api/financial-reports/insights/:id/read`

**Example:** `/api/financial-reports/insights/ce603a25-c86a-4715-b524-0e05a14ca451/read`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ce603a25-c86a-4715-b524-0e05a14ca451",
    "is_read": true,
    "updatedAt": "2026-02-02T13:50:44.658Z"
  }
}
```

---

## ✅ Test Results Summary

All endpoints tested and working:
- ✅ Get Financial Report: Returns comprehensive report with 6 category breakdowns, 4-week trends, and 5 insights
- ✅ Category Breakdown: Shows allocated vs spent amounts with percentages
- ✅ Weekly Trends: Displays spending patterns week by week
- ✅ Auto Insights: Generated alerts (Shopping 80%, Overdue debt), recommendations (savings opportunities)
- ✅ Create Custom Insight: User can add manual insights with type/title/message
- ✅ Mark as Read: Updates insight read status

**Insights Generated:**
- 🔴 Alerts: Budget limits, upcoming payments
- ⚠️ Warnings: Overdue debts
- 💡 Recommendations: Savings opportunities, good budget management

**Database:** Neon PostgreSQL  
**Base URL:** `http://localhost:3000/api`  
**Auth:** Cookie-based JWT (automatic after login)

---

## 💡 Quick Testing Flow

1. Login: `POST /api/auth/sign-in`
2. Get report: `GET /api/financial-reports?startDate=2026-02-01&endDate=2026-02-28`
3. Review insights in the report response
4. Create custom insight: `POST /api/financial-reports/insights`
5. Mark insight as read: `PATCH /api/financial-reports/insights/:id/read`

---

## 📊 Report Features

**Summary Section:**
- Total income, expenses, net savings
- Budget utilization percentage

**Category Breakdown:**
- All 6 budget categories (FOOD, TRANSPORT, ENTERTAINMENT, HEALTH, SHOPPING, OTHERS)
- Allocated amount vs spent amount
- Usage percentage for each category

**Weekly Trend:**
- 4-week spending breakdown
- Track spending patterns over time

**Insights:**
- Auto-generated based on spending patterns
- Manual insights created by users
- Read/unread status tracking
