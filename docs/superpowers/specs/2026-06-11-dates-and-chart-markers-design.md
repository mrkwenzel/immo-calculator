# Design Spec: Kaufvertragsdatum, Besitzübergangsdatum & Chart-Datummarker

Date: 2026-06-11
Topic: Date fields for investment data, calendar year labels in charts, "Heute" reference line, cashflow-seit-Besitzübergang tile

---

## 1. Overview

Two optional date fields are added to the investment data form:
- **Kaufvertragsdatum** — date the purchase contract was signed
- **Besitzübergangsdatum** — date possession transfers to the buyer (used as projection start)

When `besitzuebergangsdatum` is set, all time-series charts and the cashflow table show calendar-year labels (`Jahr 1 (2026)`, `Jahr 2 (2027)`, ...) instead of the plain relative labels. A vertical "Heute" reference line is added to both time-series charts when the current calendar year falls within the projection window.

---

## 2. State Layer

### 2.1 New fields in `defaultState` (`src/hooks/useCalculation.jsx`)
```js
kaufvertragsdatum: '',        // ISO date string YYYY-MM-DD, optional
besitzuebergangsdatum: '',    // ISO date string YYYY-MM-DD, optional
```

Both are persisted automatically via the existing `localStorage` mechanism.
Both are updated via the existing `UPDATE_FIELD` reducer action — no new reducer cases needed.

---

## 3. Cashflow Projection

### 3.1 `src/utils/cashflowProjection.js`
Add optional `startYear` parameter (integer, e.g. `2026`):

```js
export function calculateCashflowProjection(state, years, mietSteigerung, kostenSteigerung, startYear = null)
```

Each row in the returned array gains a `yearLabel` field:
- If `startYear` is provided: `Jahr ${year} (${startYear + year - 1})`
- If not: `Jahr ${year}`

All other fields remain unchanged.

### 3.2 Callers extract `startYear` from state
Both `Charts.jsx` and `CashflowContainer.jsx` derive `startYear`:
```js
const startYear = state.besitzuebergangsdatum
  ? new Date(state.besitzuebergangsdatum).getFullYear()
  : null
```
Then pass it to `calculateCashflowProjection`.

---

## 4. Charts (`src/components/Charts.jsx`)

### 4.1 X-Axis
Both `BarChart` and `LineChart` use `yearLabel` as `XAxis dataKey` instead of `year`.

### 4.2 "Heute" Reference Line
Both time-series charts (`BarChart` "Einnahmen vs Kosten" and `LineChart` "Kumulierter Cashflow") receive a Recharts `ReferenceLine`:
```jsx
import { ..., ReferenceLine } from 'recharts'

// Compute today label
const todayYear = new Date().getFullYear()
const todayLabel = chartData.find(d => d.yearLabel.includes(`(${todayYear})`))?.yearLabel ?? null

// In chart JSX:
{todayLabel && (
  <ReferenceLine
    x={todayLabel}
    stroke="#ef4444"
    strokeDasharray="6 3"
    label={{ value: 'Heute', position: 'top', fill: '#ef4444', fontSize: 12 }}
  />
)}
```

Only renders when `besitzuebergangsdatum` is set and today's year is within the projection range.

---

## 5. "Cashflow seit Besitzübergang" Tile

### 5.1 Visibility
Only rendered when `besitzuebergangsdatum` is set **and** the date is in the past relative to today.

### 5.2 Calculation (`src/utils/cashflowProjection.js`)
A new exported helper `calculateCashflowSincePossession(state, mietSteigerung, kostenSteigerung)`:

1. Derive `startDate` from `state.besitzuebergangsdatum`.
2. Derive `today = new Date()`.
3. Compute `elapsedMonths` = total months elapsed since `startDate` (fractional allowed, rounded to whole months for display).
4. Walk month by month through the same growth model as `calculateCashflowProjection`: apply `mietSteigerung` and `kostenSteigerung` compounded annually per year boundary.
5. Accumulate `(miete - nichtUmlagefaehig - bankrateRelevant)` for each elapsed month.
6. Return `{ totalCashflow, elapsedMonths }`.

### 5.3 Display (`src/components/cashflow/CashflowContainer.jsx`)
A fourth summary card is added to `CashflowSummaryCards` (or a separate card below if the layout would become cramped — use a separate row):

```
┌──────────────────────────────────────────┐
│ 💰  Cashflow seit Besitzübergang          │
│     € 3.240 (27 Monate)                  │
└──────────────────────────────────────────┘
```

- Title: "Cashflow seit Besitzübergang"
- Value: formatted currency
- Subtitle: `N Monate` elapsed
- Color: green if positive, red if negative
- Only shown when `besitzuebergangsdatum` is set and in the past

---

## 6. Cashflow Table (`src/components/cashflow/CashflowPresentational.jsx`)

`CashflowTable` receives `yearLabel` from each row and displays it in the "Jahr" column. No structural changes to the table — only the cell value changes from `row.year` to `row.yearLabel`.

---

## 7. Investment Form

### 6.1 `src/components/investment/BasicDataForm.jsx`
Two new `<input type="date">` fields added below the existing Wohnfläche field:

| Field | Label | Prop in/out |
|-------|-------|-------------|
| Kaufvertragsdatum | Kaufvertragsdatum | `kaufvertragsdatum` / `onKaufvertragsdatumChange` |
| Besitzübergangsdatum | Besitzübergangsdatum | `besitzuebergangsdatum` / `onBesitzuebergangsdatumChange` |

No validation library required — use HTML `min` attribute to enforce Besitzübergangsdatum ≥ Kaufvertragsdatum when both are set.

### 6.2 `src/components/investment/InvestmentPresentational.jsx` (`BasicInvestmentForm`)
Passes the two new props down to `BasicDataForm`.

### 6.3 `src/components/investment/InvestmentContainer.jsx`
Reads `state.kaufvertragsdatum` and `state.besitzuebergangsdatum` and calls `updateField` for both.

---

## 8. Success Criteria

- Both date fields appear in Investitionsdaten and are persisted across page reloads.
- When `besitzuebergangsdatum` is set, chart x-axis labels show `Jahr N (YYYY)`.
- When `besitzuebergangsdatum` is not set, chart x-axis labels show `Jahr N` (no regression).
- A dashed red "Heute" reference line appears on both time-series charts when today's year is in the projection range.
- The cashflow table's Jahr column shows `yearLabel` (with calendar year when available).
- All existing tests pass; new unit tests cover `calculateCashflowProjection` with and without `startYear`.
- "Cashflow seit Besitzübergang" tile appears on the Cashflow page only when date is set and in the past.
- Tile value matches the growth-rate-compounded calculation for elapsed months.
- Tile is hidden when `besitzuebergangsdatum` is not set or is in the future.
