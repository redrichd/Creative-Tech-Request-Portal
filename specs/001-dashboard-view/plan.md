# Implementation Plan: Dashboard View Switcher

**Branch**: `001-dashboard-view` | **Date**: 2026-03-01 | **Spec**: [specs/001-dashboard-view/spec.md](spec.md)
**Input**: Feature specification from `/specs/001-dashboard-view/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The goal is to implement a seamless "View Switcher" in the existing request portal, allowing users to toggle between the current "Card List" view and a new "Dashboard" view. The Dashboard will provide real-time aggregated metrics (Total Requests, Today's New, Completed Total, Avg Dev Days), a department distribution donut chart, a category vs. status stacked bar chart, and an innovation momentum area chart. 

The technical approach will leverage Framer Motion for the horizontal slide transitions, maintain the existing Next.js/React architecture, and utilize Firebase Firestore listeners for real-time data aggregation to achieve the "pulse" animation effect upon data updates without requiring a full page reload.

## Technical Context

**Language/Version**: TypeScript 5+, React 19.2.3, Next.js 16.1.2
**Primary Dependencies**: Tailwind CSS v4, Framer Motion v12, Firebase v12 (Firestore), Recharts/Chart.js [NEEDS CLARIFICATION: Which charting library to use for the dashboard?]
**Storage**: Firebase Firestore
**Testing**: [NEEDS CLARIFICATION: What testing framework is currently used for unit/integration tests? (e.g., Jest, Vitest, Cypress)]
**Target Platform**: Web browsers (Desktop & Mobile)
**Project Type**: Next.js Web Application
**Performance Goals**: FCP < 1.5s, view switching < 500ms, search/filter response < 200ms
**Constraints**: Must match "Liquid Glass / iOS 26.1 Style" (high transparency, background blur, fluid mesh gradients).
**Scale/Scope**: Real-time aggregation of requests suitable for the portal's usage volume.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No specific constitution file loaded beyond standard project constraints. Proceeding.

## Project Structure

### Documentation (this feature)

```text
specs/001-dashboard-view/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── page.tsx               # Main entry point, host of the View Switcher
│   └── (components)/          # Or wherever shared components reside
│       ├── ViewSwitcher.tsx   # New: The toggle control (Matrix/Chart icons)
│       ├── DashboardView.tsx  # New: The dashboard container
│       └── CardListView.tsx   # Existing: Refactored existing list view
├── components/
│   └── dashboard/
│       ├── SummaryCards.tsx   # New: 4 summary metrics
│       ├── DepartmentChart.tsx# New: Donut chart
│       ├── CategoryChart.tsx  # New: Stacked bar chart
│       └── MomentumChart.tsx  # New: Area chart
└── lib/
    └── hooks/
        └── useDashboardData.ts# New: Real-time Firestore aggregation hook
```

**Structure Decision**: Utilizing the standard Next.js App Router structure typical for this stack. The existing page will be refactored to conditionally render (with Framer Motion) either the `CardListView` or the `DashboardView` based on state managed by a `ViewSwitcher` component.

## Verification Plan

### Automated Tests
- Build verification: `npm run build`
- Linting: `npm run lint`

### Manual Verification
1. Open the application locally `npm run dev`.
2. Observe the new View Switcher component next to the search bar.
3. Click the "Chart" icon to toggle to the Dashboard view. Verify the horizontal slide animation.
4. Verify the glassmorphism styling parameters on the dashboard components (deep purple semi-transparent background, 1px light purple border).
5. In a separate tab, add a new request.
6. Observe the first tab (Dashboard view) and verify the numbers update automatically with a pulse animation.
