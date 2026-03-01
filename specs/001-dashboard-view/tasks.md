# Tasks: Dashboard View Switcher

**Input**: Design documents from `/specs/001-dashboard-view/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for the new feature

- [x] T001 Install `recharts` dependency via npm
- [x] T002 Ensure `framer-motion` is installed and updated if necessary

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented
**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Refactor existing card list view out of `src/app/page.tsx` into a standalone `src/app/(components)/CardListView.tsx` if it is not already separated.
- [x] T004 Hoist essential filter state (status tabs, search keyword) into the parent `src/app/page.tsx` so it can be shared with both views.
- [x] T005 [P] Create `DashboardAggregate` TypeScript interface in `src/lib/types/dashboard.ts` (or equivalent models folder).

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Toggle Dashboard View (Priority: P1) 🎯 MVP

**Goal**: Users want to toggle between the existing card view and a dashboard view without losing their current filters, allowing them to see aggregated statistics and trends seamlessly.

**Independent Test**: Can be tested by clicking the new View Switcher component, verifying the horizontal slide animation occurs, and confirming the UI state toggles without page reload.

### Implementation for User Story 1

- [x] T006 [P] [US1] Create Segmented Control `ViewSwitcher` component in `src/app/(components)/ViewSwitcher.tsx` with List (Matrix) and Chart icons.
- [x] T007 [P] [US1] Create empty `DashboardView` container component in `src/app/(components)/DashboardView.tsx` with glassmorphism styling.
- [x] T008 [US1] Implement view state (`'list' | 'dashboard'`) in `src/app/page.tsx`.
- [x] T009 [US1] Wrap `CardListView` and `DashboardView` in `AnimatePresence` inside `src/app/page.tsx`.
- [x] T010 [US1] Apply `framer-motion` horizontal slide transition variants to view changes.

**Checkpoint**: At this point, User Story 1 should be fully functional; the user can toggle between the old list and an empty dashboard with a smooth animation.

---

## Phase 4: User Story 2 - Real-time Dashboard Data (Priority: P2)

**Goal**: Managers and users want to see real-time automatically aggregated data (summary, department distribution, category matrix, momentum trend) so they dont have to manually refresh to see new request changes.

**Independent Test**: Can be tested by having the dashboard open, adding/modifying a request in another session/tab, and observing the dashboard update automatically with a pulse animation.

### Implementation for User Story 2

- [x] T011 [P] [US2] Implement `useDashboardData` hook in `src/lib/hooks/useDashboardData.ts` to fetch and aggregate Firebase data using `onSnapshot`.
- [x] T012 [P] [US2] Create `SummaryCards` component in `src/components/dashboard/SummaryCards.tsx` using neon green typography and `motion.div` pulse animation for value changes.
- [x] T013 [P] [US2] Create Donut chart `DepartmentChart` in `src/components/dashboard/DepartmentChart.tsx` using Recharts.
- [x] T014 [P] [US2] Create Stacked Bar chart `CategoryChart` in `src/components/dashboard/CategoryChart.tsx` using Recharts.
- [x] T015 [P] [US2] Create Area chart `MomentumChart` in `src/components/dashboard/MomentumChart.tsx` using Recharts.
- [x] T016 [US2] Assemble `SummaryCards`, `DepartmentChart`, `CategoryChart`, and `MomentumChart` into `src/app/(components)/DashboardView.tsx`.
- [x] T017 [US2] Pass existing hoisted filter state down to `useDashboardData` to ensure charts reflect current UI filters dynamically.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Real data flows into the dashboard.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T018 Verify responsive design on mobile and desktop viewports for all dashboard charts.
- [x] T019 Ensure specific "Liquid Glass" design constraints (`rgba(255, 255, 255, 0.15)`, blur 20px, deep purple bg, 1px light purple border) are strictly met across new dashboard components.
- [x] T020 Optimize Firebase `onSnapshot` lifecycle in `useDashboardData` to prevent memory leaks (ensure cleanup on unmount).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Proceed sequentially in priority order (US1 → US2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- Foundation tasks T003, T004, and T005 can be tackled independently by different team members.
- Creating the ViewSwitcher UI (T006), Empty Dashboard (T007) can be done in parallel during Phase 3.
- Creating the actual dashboard chart views (T012, T013, T014, T015) can be completely parallelized while the hook (T011) is being developed in Phase 4.
