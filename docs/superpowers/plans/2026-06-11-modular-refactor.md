# Modular Architecture Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the project to separate financial logic into pure modules and decompose large page components into a Container/Presentational pattern.

**Architecture:**
- **Logic**: Extract `calculateDerivedValues` from `useCalculation.jsx` into `src/utils/calculations/` split by domain (investment, financing, cashflow).
- **UI**: Move shared form inputs to `src/components/shared/forms/` and split page components into Containers and Presentational components.

**Tech Stack:** React 19, Vite, Tailwind CSS, Vitest.

---

## Phase 1: Logic Extraction (The Domain Layer)

### Task 1: Create Investment Calculation Module
**Files:**
- Create: `src/utils/calculations/investment.js`
- Test: `src/utils/__tests__/investment.test.js`

- [ ] **Step 1: Write failing tests for investment logic**
  Extract logic for `gesamtinvestition` and `kaufpreisProQm` from `useCalculation.jsx` and write tests in `src/utils/__tests__/investment.test.js`.
- [ ] **Step 2: Implement `calculateInvestment` in `src/utils/calculations/investment.js`**
  Implement the logic including the absolute/percentage ancillary costs toggle.
- [ ] **Step 3: Run tests to verify**
  Run: `npm test src/utils/__tests__/investment.test.js`
- [ ] **Step 4: Commit**
  `git add src/utils/calculations/investment.js src/utils/__tests__/investment.test.js && git commit -m "feat: extract investment calculations to pure module"`

### Task 2: Create Financing Calculation Module
**Files:**
- Create: `src/utils/calculations/financing.js`
- Test: `src/utils/__tests__/financing.test.js`

- [ ] **Step 1: Write failing tests for financing logic**
  Extract multi-loan and `includeInCashflow` logic from `useCalculation.jsx`.
- [ ] **Step 2: Implement `calculateFinancing` in `src/utils/calculations/financing.js`**
- [ ] **Step 3: Run tests to verify**
- [ ] **Step 4: Commit**
  `git add src/utils/calculations/financing.js src/utils/__tests__/financing.test.js && git commit -m "feat: extract financing calculations to pure module"`

### Task 3: Create Cashflow Calculation Module
**Files:**
- Create: `src/utils/calculations/cashflow.js`
- Test: `src/utils/__tests__/cashflow.test.js`

- [ ] **Step 1: Write failing tests for cashflow logic**
  Extract `monatlicheCashflow`, `cashflowNachBank`, and `eigenkapitalRendite` logic.
- [ ] **Step 2: Implement `calculateCashflow` in `src/utils/calculations/cashflow.js`**
- [ ] **Step 3: Run tests to verify**
- [ ] **Step 4: Commit**
  `git add src/utils/calculations/cashflow.js src/utils/__tests__/cashflow.test.js && git commit -m "feat: extract cashflow calculations to pure module"`

### Task 4: Create Orchestrator and Update Hook
**Files:**
- Create: `src/utils/calculations/index.js`
- Modify: `src/hooks/useCalculation.jsx`

- [ ] **Step 1: Implement `calculateDerivedValues` in `src/utils/calculations/index.js`**
  Import the three modules and combine their results into the state object.
- [ ] **Step 2: Update `useCalculation.jsx` to import `calculateDerivedValues` from the new utility path**
- [ ] **Step 3: Run existing `useCalculation.test.jsx` to ensure no regressions**
- [ ] **Step 4: Commit**
  `git add src/utils/calculations/index.js src/hooks/useCalculation.jsx && git commit -m "refactor: connect useCalculation hook to modular calculation utilities"`

---

## Phase 2: Component Decomposition

### Task 5: Setup Shared Form Components
**Files:**
- Create: `src/components/shared/forms/`
- Modify: `src/components/InputField.jsx` $\rightarrow$ `src/components/shared/forms/InputField.jsx`
- Modify: `src/components/investment/DualModeInput.jsx` $\rightarrow$ `src/components/shared/forms/DualModeInput.jsx`

- [ ] **Step 1: Move files to new directory**
- [ ] **Step 2: Update imports in all components using these fields**
- [ ] **Step 3: Commit**
  `git add src/components/shared/forms/ && git commit -m "refactor: move shared form components to shared directory"`

### Task 6: Decompose Investment Page
**Files:**
- Create: `src/components/investment/InvestmentContainer.jsx`
- Create: `src/components/investment/BasicInvestmentForm.jsx`
- Create: `src/components/investment/AncillaryCostsSection.jsx`
- Create: `src/components/investment/InvestmentSummary.jsx`
- Modify: `src/components/InvestmentPage.jsx` (Rename/Refactor to Container)

- [ ] **Step 1: Create Presentational components and migrate UI code from `InvestmentPage`**
- [ ] **Step 2: Implement `InvestmentContainer` to handle context and state passing**
- [ ] **Step 3: Verify page renders and functions correctly**
- [ ] **Step 4: Commit**
  `git add src/components/investment/ && git commit -m "refactor: decompose InvestmentPage into container and presentational components"`

### Task 7: Decompose Financing Page
**Files:**
- Create: `src/components/financing/FinancingContainer.jsx`
- Create: `src/components/financing/LoanEntry.jsx`
- Create: `src/components/financing/FinancingOverview.jsx`
- Modify: `src/components/FinancingPage.jsx`

- [ ] **Step 1: Create `LoanEntry` for individual loan inputs**
- [ ] **Step 2: Create `FinancingOverview` for totals and EK-Rendite**
- [ ] **Step 3: Implement `FinancingContainer` and verify**
- [ ] **Step 4: Commit**
  `git add src/components/financing/ && git commit -m "refactor: decompose FinancingPage into container and presentational components"`

### Task 8: Decompose Cashflow Page
**Files:**
- Create: `src/components/cashflow/CashflowContainer.jsx`
- Create: `src/components/cashflow/CashflowTable.jsx`
- Create: `src/components/cashflow/CashflowCharts.jsx`
- Modify: `src/components/CashflowAnalysis.jsx`

- [ ] **Step 1: Extract the projection table to `CashflowTable`**
- [ ] **Step 2: Extract charts to `CashflowCharts`**
- [ ] **Step 3: Implement `CashflowContainer` and verify**
- [ ] **Step 4: Commit**
  `git add src/components/cashflow/ && git commit -m "refactor: decompose CashflowAnalysis into container and presentational components"`

---

## Final Verification
- [ ] **Step 1: Run all tests** (`npm test`)
- [ ] **Step 2: Run lint** (`npm run lint`)
- [ ] **Step 3: Manual smoke test of all pages**
- [ ] **Step 4: Final commit of cleanup**
