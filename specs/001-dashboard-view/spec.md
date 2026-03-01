# Feature Specification: Dashboard View Switcher

**Feature Branch**: `001-dashboard-view`  
**Created**: 2026-03-01  
**Status**: Draft  
**Input**: User description: "這是一個棕地專案，增加以下功能時，請不要更改現有的程式碼，並請根據本次的規格變更，一併修改所有相關的程式碼。在不破壞現有「卡片式清單」佈局的前提下，增加一個「可切換且具備即時性」的儀表板，建議採用 「視圖切換（View Switcher）」 的設計模式。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Toggle Dashboard View (Priority: P1)

Users want to toggle between the existing card view and a dashboard view without losing their current filters, allowing them to see aggregated statistics and trends seamlessly.

**Why this priority**: It is the core requirement of the feature, providing the view switching mechanism without disrupting existing workflows.

**Independent Test**: Can be tested by clicking the new View Switcher component, verifying the horizontal slide animation occurs, and confirming the UI state toggles without page reload.

**Acceptance Scenarios**:

1. **Given** the user is viewing the request portal, **When** they look at the top navigation area alongside existing filters, **Then** they see a segmented control with a "Matrix" icon (card view) and a "Chart" icon (dashboard view).
2. **Given** the user is in card view, **When** they click the dashboard icon, **Then** the main content horizontally slides to reveal the dashboard, keeping the top navigation and filters intact.
3. **Given** the user is viewing the dashboard, **When** they change the status filter (e.g., to "In Dev"), **Then** the dashboard data immediately reflects only the filtered status.

---

### User Story 2 - Real-time Dashboard Data (Priority: P2)

Managers and users want to see real-time automatically aggregated data (summary, department distribution, category matrix, momentum trend) so they dont have to manually refresh to see new request changes.

**Why this priority**: Real-time aggregation provides the operational visibility required in the dashboard.

**Independent Test**: Can be tested by having the dashboard open, adding/modifying a request in another session/tab, and observing the dashboard update automatically with a pulse animation.

**Acceptance Scenarios**:

1. **Given** the user is on the dashboard view, **When** a new request is created or updated by another user, **Then** the dashboard charts subtly pulse and update their values automatically without a browser refresh.
2. **Given** the dashboard is loaded, **When** viewing the top summary bar, **Then** four glowing metrics are displayed: Total Requests, Today's New, Completed Total, and Avg Dev Days in neon green.
3. **Given** the dashboard is loaded, **When** viewing the left section, **Then** a donut chart shows department distribution with the text "Most Active Department" in the center.

### Edge Cases

- What happens when there is no data for a specific filter (e.g., zero requests "In Dev")?
- How does system handle real-time push connection failures or timeouts?
- How does the horizontal slide animation perform on low-end devices or varying screen sizes?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a view switcher toggle (Matrix/Chart icons) beside the existing search/filter bar.
- **FR-002**: System MUST transition between the list view and dashboard view using a horizontal slide animation.
- **FR-003**: System MUST NOT reload the page or disrupt top-level navigation during view switching.
- **FR-004**: System MUST apply existing status/category filters to the dashboard data in real-time.
- **FR-005**: System MUST automatically aggregate request data by department, status, category, and creation date.
- **FR-006**: System MUST automatically receive data updates in real-time without user intervention and render them with a subtle pulse animation.
- **FR-007**: System MUST display 4 summary cards: "Total Requests", "Today New", "Completed Total", "Avg Dev Days".
- **FR-008**: System MUST display a Donut chart for Department Distribution.
- **FR-009**: System MUST display a Stacked Bar chart for Category vs Status.
- **FR-010**: System MUST display an Area chart for Innovation Momentum over the last 30 days.
- **FR-011**: System MUST style the dashboard components with a glassmorphism effect (deep purple semi-transparent background, 1px light purple border).

### Assumptions & Dependencies

- It is assumed that the backend has access to sufficient data logging to calculate metrics like "Avg Dev Days".
- The existing filtering logic can be seamlessly decoupled from the list view component to be reused by the dashboard logic.

### Key Entities *(include if feature involves data)*

- **DashboardAggregate**: Derived read-only entity representing aggregated sums, percentages, and trends across requests.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can toggle between views in under 500ms without a page reload.
- **SC-002**: The dashboard reflects new request creations/updates within 3 seconds of the backend change without manual refresh.
- **SC-003**: Existing card view functionality and layout remain 100% unaffected and intact.
- **SC-004**: Dashboard UI correctly renders on desktop and mobile viewports seamlessly applying the required glassmorphism styling.
