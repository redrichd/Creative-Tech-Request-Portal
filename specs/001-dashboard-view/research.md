# Technical Research: Dashboard View Switcher

## Clarifications Resolved

### 1. Charting Library
**Decision**: Use `recharts` (to be installed via `npm install recharts`).
**Rationale**: Recharts is highly compatible with React, customizable enough to match the complex "Liquid Glass" styling requirements (transparency, custom tooltips, gradients), and supports the specific chart types needed (Donut, Stacked Bar, Area). 
**Alternatives considered**: `chart.js` (with `react-chartjs-2`), but Recharts' declarative component-based approach fits better with Next.js/React standard practices.

### 2. Testing Framework
**Decision**: Assume standard Next.js manual verification and build/lint checks for this phase, as no overarching automated testing framework (like Vitest/Jest) is explicitly configured in `package.json` currently.
**Rationale**: The `package.json` only contains scripts for `dev`, `build`, `start`, and `lint`. Writing manual testing steps ensures reliability in the absence of a configured test runner for this specific brownfield project.
**Alternatives considered**: Setting up Jest/Vitest from scratch, but this violates the "do not change existing code/setup unnecessarily" constraint of a brownfield project unless requested.

## Technical Approach

### 1. View Switching & Animation
We will use `framer-motion` (already in `package.json`) `AnimatePresence` and `motion.div` to handle the horizontal slide transition between the Card View and Dashboard View.

### 2. Real-time Aggregation
We will create a custom React hook `useDashboardData` that utilizes Firebase's `onSnapshot` to listen to the `requests` collection. The hook will perform client-side aggregation (or leverage Cloud Firestore aggregation queries like `count()` if strictly necessary for performance, though client-side is often sufficient for manageable dataset sizes in this portal context).
The "pulse" animation upon data change will be handled by wrapping the metric values in a `motion.div` that triggers a scale/opacity keyframe whenever the underlying data value changes.

### 3. Styling
The glassmorphism requirements (`rgba(255, 255, 255, 0.15)`, blur 20px, deep purple semi-transparent background, 1px light purple border) will be implemented using Tailwind CSS arbitrary values or custom utility classes within the React components.
