# Dates & Chart Markers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Kaufvertragsdatum and Besitzübergangsdatum date fields to the investment form; show calendar-year labels on charts and the cashflow table; add a dashed "Heute" reference line to both time-series charts; add a "Cashflow seit Besitzübergang" summary tile to the Cashflow page.

**Architecture:** The two date strings live in global state (`useCalculation`) and are persisted via the existing `localStorage` mechanism — no new reducer cases needed. `calculateCashflowProjection` gains an optional `startYear` parameter that controls `yearLabel` in every returned row. A new `calculateCashflowSincePossession` helper in the same file computes the month-by-month accumulation since the possession date. Components derive `startYear` from state and pass it through.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 4, Recharts 3, Vitest.

---

## File Map

| File | Action | What changes |
|---|---|---|
| `src/hooks/useCalculation.jsx` | Modify | Add two date fields to `defaultState` |
| `src/utils/cashflowProjection.js` | Modify | Add `startYear` param + `yearLabel`; add `calculateCashflowSincePossession` |
| `src/utils/__tests__/cashflowProjection.test.js` | Create | Unit tests for both exported functions |
| `src/components/investment/BasicDataForm.jsx` | Modify | Add two `<input type="date">` fields |
| `src/components/investment/InvestmentPresentational.jsx` | Modify | Pass date props down to `BasicDataForm` |
| `src/components/investment/InvestmentContainer.jsx` | Modify | Read date state, pass `updateField` handlers |
| `src/components/cashflow/CashflowContainer.jsx` | Modify | Derive `startYear`; pass it to projection; add `CashflowSincePossession` tile |
| `src/components/cashflow/CashflowPresentational.jsx` | Modify | `CashflowTable` uses `row.yearLabel`; add `CashflowSincePossessionCard` export |
| `src/components/Charts.jsx` | Modify | Derive `startYear`; use `yearLabel` on X-axis; add `ReferenceLine` "Heute" |

---

## Task 1: Add date fields to state

**Files:**
- Modify: `src/hooks/useCalculation.jsx:17-71`

- [ ] **Step 1: Add the two fields to `defaultState`**

  In `src/hooks/useCalculation.jsx`, inside `const defaultState = { ... }` after `wohnflaeche: 0,` add:

  ```js
  // Datumsfelder
  kaufvertragsdatum: '',        // ISO date string YYYY-MM-DD, optional
  besitzuebergangsdatum: '',    // ISO date string YYYY-MM-DD, optional
  ```

- [ ] **Step 2: Verify no tests break**

  ```bash
  npm test -- run
  ```
  Expected: all tests pass (new fields default to `''`, no calculation logic touched).

- [ ] **Step 3: Commit**

  ```bash
  git add src/hooks/useCalculation.jsx
  git commit -m "feat: add kaufvertragsdatum and besitzuebergangsdatum to state"
  ```

---

## Task 2: Update `calculateCashflowProjection` with `yearLabel`

**Files:**
- Modify: `src/utils/cashflowProjection.js`
- Create: `src/utils/__tests__/cashflowProjection.test.js`

- [ ] **Step 1: Write failing tests**

  Create `src/utils/__tests__/cashflowProjection.test.js`:

  ```js
  import { describe, it, expect } from 'vitest'
  import { calculateCashflowProjection } from '../cashflowProjection.js'

  const baseState = {
    nettokaltmiete: 1000,
    stellplatzmiete: 0,
    nichtUmlagefaehigeKosten: 100,
    monatlicherKapitaldienst: 500,
    kapitaldienstRelevantForCashflow: 500,
  }

  describe('calculateCashflowProjection', () => {
    it('returns yearLabel as "Jahr N" when no startYear given', () => {
      const result = calculateCashflowProjection(baseState, 3, 0, 0)
      expect(result[0].yearLabel).toBe('Jahr 1')
      expect(result[2].yearLabel).toBe('Jahr 3')
    })

    it('returns yearLabel as "Jahr N (YYYY)" when startYear given', () => {
      const result = calculateCashflowProjection(baseState, 3, 0, 0, 2026)
      expect(result[0].yearLabel).toBe('Jahr 1 (2026)')
      expect(result[1].yearLabel).toBe('Jahr 2 (2027)')
      expect(result[2].yearLabel).toBe('Jahr 3 (2028)')
    })

    it('returns correct number of rows', () => {
      const result = calculateCashflowProjection(baseState, 5, 2, 2)
      expect(result).toHaveLength(5)
    })

    it('accumulates kumuliert correctly', () => {
      const result = calculateCashflowProjection(baseState, 2, 0, 0)
      const year1NettoCashflow = result[0].nettoCashflow
      expect(result[1].kumuliert).toBeCloseTo(year1NettoCashflow * 2, 0)
    })
  })
  ```

- [ ] **Step 2: Run test to verify it fails**

  ```bash
  npm test -- run src/utils/__tests__/cashflowProjection.test.js
  ```
  Expected: FAIL — `yearLabel` is undefined.

- [ ] **Step 3: Update `calculateCashflowProjection` in `src/utils/cashflowProjection.js`**

  Change the function signature and add `yearLabel` to each pushed row:

  ```js
  export function calculateCashflowProjection(state, years, mietSteigerung, kostenSteigerung, startYear = null) {
    const projection = []
    let currentMiete = (parseFloat(state.nettokaltmiete) || 0) + (parseFloat(state.stellplatzmiete) || 0)
    let currentKosten = parseFloat(state.nichtUmlagefaehigeKosten) || 0
    const mtlBankrateGesamt = parseFloat(state.monatlicherKapitaldienst) || 0
    const mtlBankrateRelevant = parseFloat(state.kapitaldienstRelevantForCashflow) || 0

    for (let year = 1; year <= years; year++) {
      if (year > 1) {
        currentMiete *= (1 + mietSteigerung / 100)
        currentKosten *= (1 + kostenSteigerung / 100)
      }

      const jahresmiete = currentMiete * 12
      const jahreskosten = currentKosten * 12
      const jahresOperativerCashflow = jahresmiete - jahreskosten
      const jahresBankrateGesamt = mtlBankrateGesamt * 12
      const jahresBankrateRelevant = mtlBankrateRelevant * 12

      const nettoCashflow = jahresOperativerCashflow - jahresBankrateRelevant
      const kumuliert = projection.length > 0
        ? projection[projection.length - 1].kumuliert + nettoCashflow
        : nettoCashflow

      const yearLabel = startYear
        ? `Jahr ${year} (${startYear + year - 1})`
        : `Jahr ${year}`

      projection.push({
        year,
        yearLabel,
        jahresmiete,
        jahreskosten,
        jahresOperativerCashflow,
        jahresBankrateGesamt,
        jahresBankrateRelevant,
        nettoCashflow,
        kumuliert,
        monatlicheMiete: currentMiete,
        monatlicheKosten: currentKosten
      })
    }

    return projection
  }
  ```

- [ ] **Step 4: Run test to verify it passes**

  ```bash
  npm test -- run src/utils/__tests__/cashflowProjection.test.js
  ```
  Expected: all 4 tests pass.

- [ ] **Step 5: Run full test suite to check for regressions**

  ```bash
  npm test -- run
  ```
  Expected: all tests pass.

- [ ] **Step 6: Commit**

  ```bash
  git add src/utils/cashflowProjection.js src/utils/__tests__/cashflowProjection.test.js
  git commit -m "feat: add yearLabel and startYear param to calculateCashflowProjection"
  ```

---

## Task 3: Add `calculateCashflowSincePossession`

**Files:**
- Modify: `src/utils/cashflowProjection.js`
- Modify: `src/utils/__tests__/cashflowProjection.test.js`

- [ ] **Step 1: Add tests for the new helper**

  Append to `src/utils/__tests__/cashflowProjection.test.js`:

  ```js
  import { calculateCashflowSincePossession } from '../cashflowProjection.js'

  describe('calculateCashflowSincePossession', () => {
    it('returns zero cashflow and zero months when besitzuebergangsdatum is empty', () => {
      const state = { ...baseState, besitzuebergangsdatum: '' }
      const result = calculateCashflowSincePossession(state, 0, 0)
      expect(result.totalCashflow).toBe(0)
      expect(result.elapsedMonths).toBe(0)
    })

    it('returns zero cashflow and zero months when date is in the future', () => {
      const future = new Date()
      future.setFullYear(future.getFullYear() + 1)
      const state = { ...baseState, besitzuebergangsdatum: future.toISOString().slice(0, 10) }
      const result = calculateCashflowSincePossession(state, 0, 0)
      expect(result.totalCashflow).toBe(0)
      expect(result.elapsedMonths).toBe(0)
    })

    it('accumulates cashflow for elapsed months (no growth)', () => {
      // 12 months ago
      const past = new Date()
      past.setFullYear(past.getFullYear() - 1)
      const state = {
        ...baseState,
        nettokaltmiete: 1000,
        stellplatzmiete: 0,
        nichtUmlagefaehigeKosten: 100,
        kapitaldienstRelevantForCashflow: 400,
        besitzuebergangsdatum: past.toISOString().slice(0, 10)
      }
      const result = calculateCashflowSincePossession(state, 0, 0)
      // monthly net = 1000 - 100 - 400 = 500
      expect(result.elapsedMonths).toBe(12)
      expect(result.totalCashflow).toBeCloseTo(500 * 12, 0)
    })
  })
  ```

- [ ] **Step 2: Run tests to verify they fail**

  ```bash
  npm test -- run src/utils/__tests__/cashflowProjection.test.js
  ```
  Expected: 3 new tests FAIL — `calculateCashflowSincePossession` not exported.

- [ ] **Step 3: Implement `calculateCashflowSincePossession` in `src/utils/cashflowProjection.js`**

  Append after `calculateCashflowProjection`:

  ```js
  /**
   * Computes the accumulated cashflow from the possession date up to today.
   * Returns { totalCashflow: number, elapsedMonths: number }.
   * Returns zeroes if besitzuebergangsdatum is empty or in the future.
   *
   * @param {Object} state
   * @param {number} mietSteigerung  - Annual rent increase in percent
   * @param {number} kostenSteigerung - Annual cost increase in percent
   */
  export function calculateCashflowSincePossession(state, mietSteigerung, kostenSteigerung) {
    if (!state.besitzuebergangsdatum) return { totalCashflow: 0, elapsedMonths: 0 }

    const startDate = new Date(state.besitzuebergangsdatum)
    const today = new Date()

    if (startDate >= today) return { totalCashflow: 0, elapsedMonths: 0 }

    // Count whole elapsed months
    const elapsedMonths =
      (today.getFullYear() - startDate.getFullYear()) * 12 +
      (today.getMonth() - startDate.getMonth())

    if (elapsedMonths <= 0) return { totalCashflow: 0, elapsedMonths: 0 }

    let currentMiete = (parseFloat(state.nettokaltmiete) || 0) + (parseFloat(state.stellplatzmiete) || 0)
    let currentKosten = parseFloat(state.nichtUmlagefaehigeKosten) || 0
    const mtlBankrateRelevant = parseFloat(state.kapitaldienstRelevantForCashflow) || 0

    let totalCashflow = 0
    let currentYear = 1 // tracks which projection year we are in (1-indexed)

    for (let m = 1; m <= elapsedMonths; m++) {
      // Apply annual growth at each year boundary (after month 12, 24, ...)
      const yearForMonth = Math.ceil(m / 12)
      if (yearForMonth > currentYear) {
        currentMiete *= (1 + mietSteigerung / 100)
        currentKosten *= (1 + kostenSteigerung / 100)
        currentYear = yearForMonth
      }
      totalCashflow += currentMiete - currentKosten - mtlBankrateRelevant
    }

    return { totalCashflow, elapsedMonths }
  }
  ```

- [ ] **Step 4: Run tests to verify they pass**

  ```bash
  npm test -- run src/utils/__tests__/cashflowProjection.test.js
  ```
  Expected: all tests pass.

- [ ] **Step 5: Commit**

  ```bash
  git add src/utils/cashflowProjection.js src/utils/__tests__/cashflowProjection.test.js
  git commit -m "feat: add calculateCashflowSincePossession helper"
  ```

---

## Task 4: Add date input fields to the Investment form

**Files:**
- Modify: `src/components/investment/BasicDataForm.jsx`
- Modify: `src/components/investment/InvestmentPresentational.jsx`
- Modify: `src/components/investment/InvestmentContainer.jsx`

- [ ] **Step 1: Update `BasicDataForm` to accept and render the two date fields**

  Replace the entire content of `src/components/investment/BasicDataForm.jsx`:

  ```jsx
  import { Calculator } from 'lucide-react'
  import InputField from '../shared/forms/InputField'
  import { validatePurchasePrice, validateArea } from '../../utils/validation'

  const BasicDataForm = ({
      kaufpreis,
      wohnflaeche,
      kaufvertragsdatum,
      besitzuebergangsdatum,
      onKaufpreisChange,
      onWohnflaecheChange,
      onKaufvertragsdatumChange,
      onBesitzuebergangsdatumChange
  }) => {
      return (
          <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calculator className="mr-2" size={20} />
                  Grunddaten
              </h3>
              <div className="space-y-4">
                  <InputField
                      label="Kaufpreis (€)"
                      value={kaufpreis}
                      onChange={onKaufpreisChange}
                      validator={validatePurchasePrice}
                      placeholder="z.B. 250000"
                  />

                  <InputField
                      label="Wohnfläche (m²)"
                      value={wohnflaeche}
                      onChange={onWohnflaecheChange}
                      validator={validateArea}
                      placeholder="z.B. 85"
                  />

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                          Kaufvertragsdatum
                      </label>
                      <input
                          type="date"
                          className="input-field"
                          value={kaufvertragsdatum}
                          onChange={(e) => onKaufvertragsdatumChange(e.target.value)}
                      />
                  </div>

                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                          Besitzübergangsdatum
                      </label>
                      <input
                          type="date"
                          className="input-field"
                          value={besitzuebergangsdatum}
                          min={kaufvertragsdatum || undefined}
                          onChange={(e) => onBesitzuebergangsdatumChange(e.target.value)}
                      />
                  </div>
              </div>
          </div>
      )
  }

  export default BasicDataForm
  ```

- [ ] **Step 2: Update `BasicInvestmentForm` in `InvestmentPresentational.jsx` to pass the new props**

  Replace the `BasicInvestmentForm` function in `src/components/investment/InvestmentPresentational.jsx`:

  ```jsx
  const BasicInvestmentForm = ({ state, updateField, updateNebenkosten, updateNebenkostenProzent, updateNebenkostenModus }) => (
      <div className="space-y-6">
          <BasicDataForm
              kaufpreis={state.kaufpreis}
              wohnflaeche={state.wohnflaeche}
              kaufvertragsdatum={state.kaufvertragsdatum}
              besitzuebergangsdatum={state.besitzuebergangsdatum}
              onKaufpreisChange={(val) => updateField('kaufpreis', val)}
              onWohnflaecheChange={(val) => updateField('wohnflaeche', val)}
              onKaufvertragsdatumChange={(val) => updateField('kaufvertragsdatum', val)}
              onBesitzuebergangsdatumChange={(val) => updateField('besitzuebergangsdatum', val)}
          />
          <AncillaryCostsForm
              state={state}
              onNebenkostenChange={updateNebenkosten}
              onNebenkostenProzentChange={updateNebenkostenProzent}
              onModusChange={updateNebenkostenModus}
          />
          <NebenkostenPresets />
      </div>
  )
  ```

  `InvestmentContainer.jsx` already passes `updateField` — no changes needed there.

- [ ] **Step 3: Manually verify the date fields render on the Investitionsdaten page**

  ```bash
  npm run dev
  ```
  Navigate to the Investitionsdaten page. Confirm two date fields appear below Wohnfläche. Set Kaufvertragsdatum; verify Besitzübergangsdatum `min` attribute updates accordingly. Reload the page; confirm values persist (localStorage).

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/investment/BasicDataForm.jsx src/components/investment/InvestmentPresentational.jsx
  git commit -m "feat: add Kaufvertragsdatum and Besitzübergangsdatum date fields to investment form"
  ```

---

## Task 5: Use `yearLabel` in the Cashflow table and pass `startYear` from `CashflowContainer`

**Files:**
- Modify: `src/components/cashflow/CashflowContainer.jsx`
- Modify: `src/components/cashflow/CashflowPresentational.jsx`

- [ ] **Step 1: Update `CashflowContainer` to derive `startYear` and pass it to the projection**

  Replace `src/components/cashflow/CashflowContainer.jsx` in full:

  ```jsx
  import { useState, useMemo } from 'react'
  import { useCalculation } from '../../hooks/useCalculation'
  import { calculateCashflowProjection, calculateCashflowSincePossession } from '../../utils/cashflowProjection'
  import { CashflowTable, CashflowSummaryCards, CashflowSincePossessionCard } from './CashflowPresentational'

  const CashflowContainer = () => {
      const { state } = useCalculation()
      const [years, setYears] = useState(10)
      const [mietSteigerung, setMietSteigerung] = useState(2)
      const [kostenSteigerung, setKostenSteigerung] = useState(2)

      const startYear = state.besitzuebergangsdatum
          ? new Date(state.besitzuebergangsdatum).getFullYear()
          : null

      const projection = useMemo(() =>
          calculateCashflowProjection(state, years, mietSteigerung, kostenSteigerung, startYear),
          [state, years, mietSteigerung, kostenSteigerung, startYear])

      const sincePossession = useMemo(() =>
          calculateCashflowSincePossession(state, mietSteigerung, kostenSteigerung),
          [state, mietSteigerung, kostenSteigerung])

      const totalCashflow = projection[projection.length - 1]?.kumuliert || 0
      const averageYearlyCashflow = totalCashflow / years

      const showSincePossession = !!state.besitzuebergangsdatum &&
          new Date(state.besitzuebergangsdatum) < new Date()

      return (
          <div className="space-y-6">
              <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Cashflow-Analyse</h1>
                  <p className="text-gray-600">Langfristige Cashflow-Projektion Ihrer Immobilie</p>
              </div>

              {/* Einstellungen */}
              <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Projektionsparameter</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Projektionszeitraum (Jahre)</label>
                          <input type="number" className="input-field" value={years}
                              onChange={(e) => setYears(parseInt(e.target.value) || 10)} min="1" max="30" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mietsteigerung pro Jahr (%)</label>
                          <input type="number" step="0.1" className="input-field" value={mietSteigerung}
                              onChange={(e) => setMietSteigerung(parseFloat(e.target.value) || 2)} />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Kostensteigerung pro Jahr (%)</label>
                          <input type="number" step="0.1" className="input-field" value={kostenSteigerung}
                              onChange={(e) => setKostenSteigerung(parseFloat(e.target.value) || 2)} />
                      </div>
                  </div>
              </div>

              <CashflowSummaryCards
                  totalCashflow={totalCashflow}
                  averageYearlyCashflow={averageYearlyCashflow}
                  years={years}
                  gesamtinvestition={state.gesamtinvestition}
              />

              {showSincePossession && (
                  <CashflowSincePossessionCard
                      totalCashflow={sincePossession.totalCashflow}
                      elapsedMonths={sincePossession.elapsedMonths}
                  />
              )}

              <CashflowTable projection={projection} />

              {/* Break-Even Analyse */}
              {state.gesamtinvestition > 0 && (
                  <div className="card">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Break-Even Analyse</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <p className="text-gray-600 mb-2">Zeit bis zur Amortisation der Gesamtinvestition:</p>
                              {(() => {
                                  const breakEvenYear = projection.findIndex(row => row.kumuliert >= state.gesamtinvestition)
                                  return breakEvenYear === -1
                                      ? <p className="text-lg font-bold text-red-600">Nicht innerhalb von {years} Jahren</p>
                                      : <p className="text-lg font-bold text-green-600">{breakEvenYear + 1} Jahre</p>
                              })()}
                          </div>
                          <div>
                              <p className="text-gray-600 mb-2">Gesamtinvestition:</p>
                              <p className="text-lg font-bold text-gray-900">
                                  {state.gesamtinvestition.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                              </p>
                          </div>
                      </div>
                  </div>
              )}
          </div>
      )
  }

  export default CashflowContainer
  ```

- [ ] **Step 2: Update `CashflowPresentational.jsx` — use `yearLabel` in table, add `CashflowSincePossessionCard`**

  Replace `src/components/cashflow/CashflowPresentational.jsx` in full:

  ```jsx
  import { formatCurrency } from '../../utils/formatters'
  import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

  const CashflowTable = ({ projection }) => (
      <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Jährliche Cashflow-Projektion
          </h3>
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jahr</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monatl. Miete</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operat. CF (J)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bankrate (J)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Netto-CF (J)</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kumuliert</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {projection.map((row) => (
                          <tr key={row.year} className={row.year % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.yearLabel}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.monatlicheMiete)}</td>
                              <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${row.jahresOperativerCashflow >= 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                  {formatCurrency(row.jahresOperativerCashflow)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600">{formatCurrency(row.jahresBankrateGesamt)}</td>
                              <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${row.nettoCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(row.nettoCashflow)}
                              </td>
                              <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${row.kumuliert >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(row.kumuliert)}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  )

  const CashflowSummaryCards = ({ totalCashflow, averageYearlyCashflow, years, gesamtinvestition }) => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card">
              <div className="flex items-center">
                  <div className="bg-green-500 p-3 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Gesamter Cashflow ({years} Jahre)</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCashflow)}</p>
                  </div>
              </div>
          </div>
          <div className="card">
              <div className="flex items-center">
                  <div className="bg-blue-500 p-3 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Durchschnitt pro Jahr</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(averageYearlyCashflow)}</p>
                  </div>
              </div>
          </div>
          <div className="card">
              <div className="flex items-center">
                  <div className={`${totalCashflow >= 0 ? 'bg-green-500' : 'bg-red-500'} p-3 rounded-lg`}>
                      {totalCashflow >= 0
                          ? <TrendingUp className="h-6 w-6 text-white" />
                          : <TrendingDown className="h-6 w-6 text-white" />
                      }
                  </div>
                  <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">ROI nach {years} Jahren</p>
                      <p className="text-2xl font-bold text-gray-900">
                          {gesamtinvestition > 0
                              ? ((totalCashflow / gesamtinvestition) * 100).toFixed(1) + '%'
                              : '0%'
                          }
                      </p>
                  </div>
              </div>
          </div>
      </div>
  )

  const CashflowSincePossessionCard = ({ totalCashflow, elapsedMonths }) => (
      <div className="card">
          <div className="flex items-center">
              <div className={`${totalCashflow >= 0 ? 'bg-green-500' : 'bg-red-500'} p-3 rounded-lg`}>
                  <Wallet className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Cashflow seit Besitzübergang</p>
                  <p className={`text-2xl font-bold ${totalCashflow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(totalCashflow)}
                  </p>
                  <p className="text-xs text-gray-500">{elapsedMonths} Monate</p>
              </div>
          </div>
      </div>
  )

  export { CashflowTable, CashflowSummaryCards, CashflowSincePossessionCard }
  ```

- [ ] **Step 3: Run full test suite**

  ```bash
  npm test -- run
  ```
  Expected: all tests pass.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/cashflow/CashflowContainer.jsx src/components/cashflow/CashflowPresentational.jsx
  git commit -m "feat: use yearLabel in cashflow table and add CashflowSincePossession tile"
  ```

---

## Task 6: Update Charts — `yearLabel` X-axis and "Heute" reference line

**Files:**
- Modify: `src/components/Charts.jsx`

- [ ] **Step 1: Update `Charts.jsx`**

  Replace `src/components/Charts.jsx` in full:

  ```jsx
  import { useState, useMemo } from 'react'
  import { useCalculation } from '../hooks/useCalculation'
  import { calculateCashflowProjection } from '../utils/cashflowProjection'
  import { formatCurrency } from '../utils/formatters'
  import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, ReferenceLine
  } from 'recharts'

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const Charts = () => {
    const { state } = useCalculation()
    const [years] = useState(10)
    const [mietSteigerung] = useState(2)
    const [kostenSteigerung] = useState(2)

    const startYear = state.besitzuebergangsdatum
      ? new Date(state.besitzuebergangsdatum).getFullYear()
      : null

    // Cashflow-Daten für Diagramme
    const chartData = useMemo(() => {
      const rawProjection = calculateCashflowProjection(state, years, mietSteigerung, kostenSteigerung, startYear)

      return rawProjection.map(row => ({
        yearLabel: row.yearLabel,
        miete: Math.round(row.jahresmiete),
        operativ: Math.round(row.jahreskosten),
        bank: Math.round(row.jahresBankrateGesamt),
        totalKosten: Math.round(row.jahreskosten + row.jahresBankrateGesamt),
        cashflow: Math.round(row.nettoCashflow),
        kumuliert: Math.round(row.kumuliert)
      }))
    }, [state, years, mietSteigerung, kostenSteigerung, startYear])

    // "Heute" reference line: only when startYear is set and today's year is in range
    const todayYear = new Date().getFullYear()
    const todayLabel = startYear
      ? (chartData.find(d => d.yearLabel.includes(`(${todayYear})`))?.yearLabel ?? null)
      : null

    // Kostenverteilung für Pie Chart
    const kostenData = useMemo(() => {
      const actualNebenkosten = state.berechneteNebenkosten || state.kaufnebenkosten
      return [
        { name: 'Kaufpreis', value: state.kaufpreis, color: '#3b82f6' },
        { name: 'Makler', value: actualNebenkosten.makler, color: '#ef4444' },
        { name: 'Notar', value: actualNebenkosten.notar, color: '#f59e0b' },
        { name: 'Grunderwerbssteuer', value: actualNebenkosten.grunderwerbssteuer, color: '#10b981' },
        { name: 'Sonstige', value: actualNebenkosten.sonstige, color: '#8b5cf6' }
      ].filter(item => item.value > 0)
    }, [state.kaufpreis, state.berechneteNebenkosten, state.kaufnebenkosten])

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Diagramme & Visualisierungen
          </h1>
          <p className="text-gray-600">
            Grafische Darstellung Ihrer Immobilien-Investition
          </p>
        </div>

        {/* Cashflow-Entwicklung */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Einnahmen vs Kosten (inkl. Finanzierung)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="yearLabel" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k €`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="miete" fill="#10b981" name="Mieteinnahmen" />
                <Bar dataKey="operativ" stackId="a" fill="#ea580c" name="Bewirtschaftung" />
                <Bar dataKey="bank" stackId="a" fill="#ef4444" name="Bankrate" />
                {todayLabel && (
                  <ReferenceLine
                    x={todayLabel}
                    stroke="#ef4444"
                    strokeDasharray="6 3"
                    label={{ value: 'Heute', position: 'top', fill: '#ef4444', fontSize: 12 }}
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Kumulierter Cashflow */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Kumulierter Cashflow über Zeit (nach Bank)
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="yearLabel" />
                <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k €`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="kumuliert"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  name="Kumuliert"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="cashflow"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Jahres-Cashflow (Netto)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                />
                {todayLabel && (
                  <ReferenceLine
                    x={todayLabel}
                    stroke="#ef4444"
                    strokeDasharray="6 3"
                    label={{ value: 'Heute', position: 'top', fill: '#ef4444', fontSize: 12 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Kostenverteilung */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Investitionskosten-Verteilung
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={kostenData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {kostenData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Rendite-Vergleich */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Rendite-Kennzahlen
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Brutto', wert: state.bruttomietrendite || 0 },
                    { name: 'Netto (Op.)', wert: state.nettomietrendite || 0 },
                    { name: 'EK-Rendite', wert: state.eigenkapitalRendite || 0 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                  <Tooltip formatter={(value) => `${value.toFixed(2)}%`} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="wert" name="Rendite %">
                    {[
                      { fill: '#3b82f6' },
                      { fill: '#8b5cf6' },
                      { fill: '#10b981' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    )
  }

  export default Charts
  ```

- [ ] **Step 2: Run full test suite**

  ```bash
  npm test -- run
  ```
  Expected: all tests pass.

- [ ] **Step 3: Manual smoke test**

  ```bash
  npm run dev
  ```
  - Without `besitzuebergangsdatum`: X-axis shows `Jahr 1`, `Jahr 2`, …, no reference line.
  - With `besitzuebergangsdatum` set to a past year (e.g. 2024): X-axis shows `Jahr 1 (2024)`, …; dashed red "Heute" line appears on both time-series charts at the current year label.
  - With a future date: no reference line appears.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/Charts.jsx
  git commit -m "feat: use yearLabel on chart X-axis and add Heute reference line"
  ```

---

## Final Verification

- [ ] **Step 1: Run full test suite**

  ```bash
  npm test -- run
  ```
  Expected: all tests pass.

- [ ] **Step 2: Run lint**

  ```bash
  npm run lint
  ```
  Expected: 0 errors, 0 warnings.

- [ ] **Step 3: Run docker build to confirm production build succeeds**

  ```bash
  docker build -t immo-calculator .
  ```
  Expected: BUILD successful.

- [ ] **Step 4: Final commit**

  ```bash
  git add .
  git commit -m "chore: final cleanup after dates and chart markers feature"
  ```
