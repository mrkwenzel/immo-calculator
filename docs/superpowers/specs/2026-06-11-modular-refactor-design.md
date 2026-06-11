# Design Spec: Modular Architecture Refactor
Date: 2026-06-11
Topic: Refactoring State Logic and Component Structure

## 1. Overview
The goal of this refactor is to transition the "Immobilien Kalkulator" from a monolithic hook/page structure to a modular, domain-driven architecture. This will improve maintainability, testability, and scalability.

## 2. Logic Architecture (Domain Layer)

### 2.1 Module Decomposition
The calculation logic currently housed in `useCalculation.jsx` will be extracted into a dedicated utility directory: `src/utils/calculations/`.

**Modules:**
- `investment.js`: 
    - Calculates total investment, purchase price per sqm, and ancillary costs.
    - Handles absolute vs. percentage mode for ancillary costs.
- `financing.js`: 
    - Manages multi-loan logic (up to 3 loans).
    - Calculates monthly capital service (Annuity) and total loan amounts.
    - Handles the `includeInCashflow` toggle logic.
- `cashflow.js`: 
    - Calculates operational cash flow (Rent - non-recoverable costs).
    - Calculates net cash flow (Operational - Bank rates).
    - Computes Equity Yield (EK-Rendite).
- `index.js`: 
    - Acts as the orchestrator.
    - Imports the specialized modules.
    - Exports a single `calculateDerivedValues(state)` function to maintain backward compatibility with the `useCalculation` hook.

### 2.2 Data Flow
`useCalculation` Hook $\rightarrow$ `calculations/index.js` $\rightarrow$ `[investment|financing|cashflow].js` $\rightarrow$ `Derived State Object` $\rightarrow$ `useCalculation` State.

## 3. Component Decomposition

### 3.1 Shared Components
A new directory `src/components/shared/forms/` will be created to house generic, reusable input patterns:
- `InputField.jsx` (Migrated from `src/components/`)
- `DualModeInput.jsx` (Migrated from `src/components/investment/`)

### 3.2 Page Decomposition
Page components will be split into **Containers** (logic/context) and **Presentational Components** (UI).

#### Investment Page
- `InvestmentContainer.jsx`: Manages context and coordinates the flow.
- `BasicInvestmentForm.jsx`: Fields for purchase price and area.
- `AncillaryCostsSection.jsx`: Logic for ancillary cost inputs.
- `InvestmentSummary.jsx`: Display of KPIs and rating.

#### Financing Page
- `FinancingContainer.jsx`: Manages loan state.
- `LoanEntry.jsx`: Individual loan input fields (repeated for each loan).
- `FinancingOverview.jsx`: Summary of total loan and equity yield.

#### Cashflow Page
- `CashflowContainer.jsx`: Manages projection state.
- `CashflowTable.jsx`: The detailed year-by-year projection grid.
- `CashflowCharts.jsx`: The Recharts visualizations.

## 4. Testing Strategy
- **Unit Tests**: Shift focus from testing the hook to testing the pure functions in `src/utils/calculations/*.js`. This allows for exhaustive edge-case testing without mocking React context.
- **Component Tests**: Introduce basic rendering tests for the new presentational components to ensure they receive and display props correctly.

## 5. Success Criteria
- `useCalculation.jsx` is significantly reduced in size, acting only as a state provider.
- `calculateDerivedValues` is moved to a pure utility folder.
- No regression in calculation results.
- Page components are broken down into smaller, focused files (< 150 lines each).
- All existing tests pass and new coverage is added for the extracted logic.
