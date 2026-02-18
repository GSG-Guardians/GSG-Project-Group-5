# Home Module API Reference

## Authentication Required

Endpoint requires Bearer JWT authentication.

## Endpoint

### Get Home Overview

- **Method:** `GET`
- **Path:** `/api/v1/home/overview`
- **Purpose:** Return all data needed for Flutter Home screen in one request.

## Response Shape

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "Ghydaa",
      "avatarUrl": "https://ik.imagekit.io/app/avatar.webp"
    },
    "currency": {
      "id": "uuid",
      "code": "USD",
      "symbol": "$",
      "name": "United States (US Dollar)"
    },
    "balance": {
      "current": "1234.56"
    },
    "expenseDue": {
      "amount": "456.78",
      "periodLabel": "current_month",
      "startDate": "2026-02-01",
      "endDate": "2026-02-28"
    },
    "attentionNeeded": [
      {
        "id": "uuid",
        "type": "alert",
        "title": "Shopping Budget Near Limit",
        "message": "You have spent 80% of your Shopping budget.",
        "isRead": false,
        "progressPercent": 80,
        "createdAt": "2026-02-10T08:00:00.000Z"
      }
    ]
  }
}
```

## Data Sources Used

- Header user data and balance: authenticated `req.user`
- Currency details: user's `defaultCurrencyId`
- Expense Due: `ExpensesService.getOverview(user, { period: 'month' }).totalExpenses`
- Attention Needed: `financial_insight` entries for current month
- Order: unread first, then newest first
- Limit: top 3 items

## `progressPercent` Rules

- If message contains `%`, first percentage value is used and clipped to `0..100`.
- If no percentage:
- `warning` => `100`
- `alert` => `85`
- `recommendation` or `info` => `65`
- any other type => `50`

