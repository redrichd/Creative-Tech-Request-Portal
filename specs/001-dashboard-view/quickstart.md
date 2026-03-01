# Quickstart: Dashboard View Switcher

## Setup

1.  Ensure you have checked out the branch `001-dashboard-view`.
    ```bash
    git checkout 001-dashboard-view
    ```

2.  Install new dependencies required for the dashboard charts:
    ```bash
    npm install recharts
    ```
    *Note: `framer-motion` and Tailwind are already installed.*

## Implementation Steps

The implementation is broken down into the following key phases:

### Phase 1: Context & State Refactoring
1.  Locate the main page component (likely `src/app/page.tsx` or similar).
2.  Extract the existing "Card List" rendering logic into a standalone `CardListView` component if it isn't already.
3.  Ensure the filter state (status tabs, search input) is managed at the parent level so it can be passed to both views.

### Phase 2: The View Switcher Component
1.  Create `src/components/ViewSwitcher.tsx`.
2.  Implement the Segmented Control UI with Matrix (List) and Chart (Dashboard) icons based on the "Liquid Glass" design language.

### Phase 3: The Dashboard Data Hook
1.  Create `src/lib/hooks/useDashboardData.ts`.
2.  Implement the Firebase Firestore `onSnapshot` listener to fetch the requests.
3.  Write the client-side aggregation logic to process the raw Firestore documents into the `DashboardAggregate` shape (Summary, Department counts, Status counts, 30-day Momentum).
4.  Ensure the hook recalculates efficiently when filter props change.

### Phase 4: Dashboard UI Components
1.  Create `src/components/dashboard/DashboardView.tsx` as the main container.
2.  Implement the 4 Summary Cards at the top using neon green typography and the pulse animation effect `motion.div` for value changes.
3.  Implement `DepartmentChart.tsx` using `recharts` `<PieChart>` and `<Pie>` components.
4.  Implement `CategoryChart.tsx` using `recharts` `<BarChart>` and stacked `<Bar>` components.
5.  Implement `MomentumChart.tsx` using `recharts` `<AreaChart>` and `<Area>` components.

### Phase 5: Integration & Animation
1.  In the main page component, implement `framer-motion`'s `<AnimatePresence>`.
2.  Conditionally render `<CardListView>` or `<DashboardView>` based on the `ViewSwitcher` state.
3.  Apply `initial`, `animate`, and `exit` variants to create the horizontal slide effect upon toggling.

## Testing Locally

Run the development server to preview changes:
```bash
npm run dev
```
Navigate to `http://localhost:3000` to verify the new View Switcher and Dashboard functionality.
