# Data Model & State Managment: Dashboard View Switcher

## Overview

The dashboard view operates primarily as a read-only aggregated view of existing `Request` entities in the Firestore database. It derives its data from the same source as the list view, ensuring consistency.

We will use a custom hook `useDashboardData` to fetch, aggregate, and provide the data to the dashboard components.

## Entities

### Request (Existing Firestore Document)

No schema changes are required to the existing `Request` document.

Fields used for aggregation:
- `status`: String ('Black', 'Gray', 'Red', 'Orange', 'Green') or literal statuses string enum depending on implementation.
- `department`: String (e.g., '居服部', '行政部', '資訊部')
- `toolName`: String (used for some meta counting if needed)
- `applyDate`: Timestamp (used for momentum trends over 30 days)
- `createdAt`: Timestamp
- `estimatedArrival`: Timestamp (used for Avg Dev Days calculation alongside complete date if available)

### DashboardAggregate (Derived Client-Side Entity)

This is a TypeScript interface representing the data structure provided by `useDashboardData` to the dashboard components.

```typescript
interface DashboardAggregate {
  summary: {
    totalRequests: number;
    todayNew: number;
    completedTotal: number;
    avgDevDays: number; // Calculated from (completedDate - applyDate) / (1000*60*60*24)
  };
  departmentDistribution: {
    department: string;
    count: number;
    fill: string; // Color code for the chart
  }[];
  categoryVsStatus: {
    category: string; // E.g., '程式', '設計', '其他' (derived from toolName/tags or explicit category if exists)
    black: number;
    gray: number;
    red: number;
    orange: number;
    green: number;
  }[];
  momentum: {
    date: string; // Format 'MM/DD'
    count: number;
  }[];
  mostActiveDepartment: string;
  isLoading: boolean;
  error: Error | null;
}
```

## State Management

1.  **View State:** Managed locally in the parent container (e.g., `app/page.tsx`) using a simple `useState<'list' | 'dashboard'>('list')`.
2.  **Filter State:** The existing filter states (status, search keyword) must be hoisted to a level where both the List View and Dashboard View can access them, or passed down via props/context. The `useDashboardData` hook should accept these filters as arguments to dynamically recalculate the aggregates.
3.  **Real-time Data:** Handled by Firebase `onSnapshot` inside `useDashboardData`. When the snapshot fires, the hook recalculates the `DashboardAggregate` object and updates its internal React state, triggering a re-render of the dependent dashboard charts.

## Validation Rules

-   If `applyDate` is strictly required for trend analysis, ensure the query filters out malformed documents without dates.
-   "Avg Dev Days" requires a valid start and end date. If a request is not 'Green' (completed) or is missing dates, it is excluded from the average calculation.
