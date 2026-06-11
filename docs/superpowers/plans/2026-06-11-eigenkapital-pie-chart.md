# Eigenkapital-Verteilung Pie Chart Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "Investitionskosten-Verteilung" pie chart with an "Eigenkapital-Verteilung" chart that shows only the investor's own equity split across kaufpreis portion and individual Nebenkosten categories, with proportional scaling when loans exceed kaufpreis.

**Architecture:** A new pure function `buildEigenkapitalPieData(state)` is added to `investment.js` alongside the existing `buildKostenPieData`. Charts.jsx swaps in the new function and handles the empty-state case. The old `buildKostenPieData` is removed since it is no longer used anywhere.

**Tech Stack:** Vitest, React, Recharts, plain JS utility functions.

---

## File Map

| File | Change |
|------|--------|
| `src/utils/calculations/investment.js` | Add `buildEigenkapitalPieData`, remove `buildKostenPieData` |
| `src/utils/__tests__/investment.test.js` | Add test suite for `buildEigenkapitalPieData`, remove `buildKostenPieData` tests |
| `src/components/Charts.jsx` | Swap import/call, update title, add empty-state message, update useMemo deps |

---

### Task 1: Add failing tests for `buildEigenkapitalPieData`

**Files:**
- Modify: `src/utils/__tests__/investment.test.js`

- [ ] **Step 1: Add the failing test suite**

Open `src/utils/__tests__/investment.test.js`. The file currently imports `buildKostenPieData`. Add an import for `buildEigenkapitalPieData` (it doesn't exist yet — the tests will fail). Also add the new describe block at the bottom of the file, **after** the existing `buildKostenPieData` describe block:

```js
import { describe, it, expect } from 'vitest'
import { calculateInvestment, buildKostenPieData, buildEigenkapitalPieData } from '../calculations/investment.js'
```

Then add at the bottom of the file:

```js
describe('buildEigenkapitalPieData', () => {
    it('normal case: Eigenkapital slice = kaufpreis - darlehen, Nebenkosten at full value', () => {
        const state = {
            kaufpreis: 200000,
            gesamtDarlehen: 160000,
            berechneteNebenkosten: { makler: 6000, notar: 2000, grunderwerbssteuer: 10000, sonstige: 0 }
        }
        const data = buildEigenkapitalPieData(state)
        const ek = data.find(d => d.name === 'Eigenkapital')
        expect(ek).toBeDefined()
        expect(ek.value).toBe(40000) // 200000 - 160000
        const makler = data.find(d => d.name === 'Makler')
        expect(makler.value).toBe(6000)
        const notar = data.find(d => d.name === 'Notar')
        expect(notar.value).toBe(2000)
        const grest = data.find(d => d.name === 'Grunderwerbssteuer')
        expect(grest.value).toBe(10000)
        // sonstige = 0, should be filtered out
        expect(data.find(d => d.name === 'Sonstige')).toBeUndefined()
    })

    it('overfinanced kaufpreis: no Eigenkapital slice, Nebenkosten scaled proportionally', () => {
        // kaufpreis=200k, darlehen=210k → kaufpreisEigen=-10k
        // nebenkosten total=20k, eigenkapital=10k → scaleFactor=0.5
        const state = {
            kaufpreis: 200000,
            gesamtDarlehen: 210000,
            berechneteNebenkosten: { makler: 6000, notar: 2000, grunderwerbssteuer: 10000, sonstige: 2000 }
        }
        const data = buildEigenkapitalPieData(state)
        expect(data.find(d => d.name === 'Eigenkapital')).toBeUndefined()
        const makler = data.find(d => d.name === 'Makler')
        expect(makler.value).toBeCloseTo(3000) // 6000 * 0.5
        const notar = data.find(d => d.name === 'Notar')
        expect(notar.value).toBeCloseTo(1000) // 2000 * 0.5
        const grest = data.find(d => d.name === 'Grunderwerbssteuer')
        expect(grest.value).toBeCloseTo(5000) // 10000 * 0.5
        const sonstige = data.find(d => d.name === 'Sonstige')
        expect(sonstige.value).toBeCloseTo(1000) // 2000 * 0.5
        // total equity check
        const total = data.reduce((sum, d) => sum + d.value, 0)
        expect(total).toBeCloseTo(10000) // eigenkapital
    })

    it('fully overfinanced (eigenkapital <= 0): returns empty array', () => {
        const state = {
            kaufpreis: 200000,
            gesamtDarlehen: 230000,
            berechneteNebenkosten: { makler: 6000, notar: 2000, grunderwerbssteuer: 10000, sonstige: 2000 }
        }
        const data = buildEigenkapitalPieData(state)
        expect(data).toEqual([])
    })

    it('string kaufpreis (InputField path): Eigenkapital value is numeric', () => {
        const state = {
            kaufpreis: '300000',
            gesamtDarlehen: 240000,
            berechneteNebenkosten: { makler: 5000, notar: 1500, grunderwerbssteuer: 15000, sonstige: 0 }
        }
        const data = buildEigenkapitalPieData(state)
        const ek = data.find(d => d.name === 'Eigenkapital')
        expect(ek.value).toBe(60000)
    })

    it('falls back to kaufnebenkosten when berechneteNebenkosten is absent', () => {
        const state = {
            kaufpreis: 150000,
            gesamtDarlehen: 100000,
            kaufnebenkosten: { makler: 3000, notar: 1000, grunderwerbssteuer: 7500, sonstige: 0 }
        }
        const data = buildEigenkapitalPieData(state)
        expect(data.find(d => d.name === 'Eigenkapital').value).toBe(50000)
        expect(data.find(d => d.name === 'Makler').value).toBe(3000)
    })

    it('eigenkapital exactly zero returns empty array', () => {
        const state = {
            kaufpreis: 200000,
            gesamtDarlehen: 220000,
            berechneteNebenkosten: { makler: 6000, notar: 2000, grunderwerbssteuer: 10000, sonstige: 2000 }
        }
        const data = buildEigenkapitalPieData(state)
        expect(data).toEqual([])
    })
})
```

- [ ] **Step 2: Run tests to verify new suite fails**

```bash
docker run --rm -v "$(pwd)":/app -w /app node:26.3.0-alpine sh -c "npm test -- run 2>&1 | grep -E 'FAIL|buildEigenkapital|✗|×|failed'"
```

Expected: errors mentioning `buildEigenkapitalPieData is not a function` or similar import failure.

---

### Task 2: Implement `buildEigenkapitalPieData` and remove `buildKostenPieData`

**Files:**
- Modify: `src/utils/calculations/investment.js`

- [ ] **Step 1: Replace `buildKostenPieData` with `buildEigenkapitalPieData`**

Open `src/utils/calculations/investment.js`. Replace the entire `buildKostenPieData` function (and its JSDoc comment) with:

```js
/**
 * Builds the data array for the Eigenkapital-Verteilung pie chart.
 *
 * Shows how the investor's own equity (gesamtinvestition - gesamtDarlehen)
 * is distributed across the purchase price portion and Nebenkosten categories.
 *
 * Cases:
 *   1. kaufpreisEigen >= 0  → Eigenkapital slice + full Nebenkosten slices
 *   2. kaufpreisEigen < 0, eigenkapital > 0  → No Eigenkapital slice, Nebenkosten scaled proportionally
 *   3. eigenkapital <= 0  → empty array (fully financed)
 */
export function buildEigenkapitalPieData(state) {
  const kaufpreis = parseFloat(state.kaufpreis) || 0
  const gesamtDarlehen = parseFloat(state.gesamtDarlehen) || 0
  const nebenkosten = state.berechneteNebenkosten || state.kaufnebenkosten || {}

  const nebenkostenSlices = [
    { name: 'Makler',              value: nebenkosten.makler              || 0, color: '#ef4444' },
    { name: 'Notar',               value: nebenkosten.notar               || 0, color: '#f59e0b' },
    { name: 'Grunderwerbssteuer',  value: nebenkosten.grunderwerbssteuer  || 0, color: '#10b981' },
    { name: 'Sonstige',            value: nebenkosten.sonstige            || 0, color: '#8b5cf6' },
  ]

  const gesamtNebenkosten = nebenkostenSlices.reduce((sum, s) => sum + s.value, 0)
  const gesamtinvestition = kaufpreis + gesamtNebenkosten
  const eigenkapital = gesamtinvestition - gesamtDarlehen

  // Case 3: fully overfinanced
  if (eigenkapital <= 0) return []

  const kaufpreisEigen = kaufpreis - gesamtDarlehen

  // Case 1: normal — darlehen does not exceed kaufpreis
  if (kaufpreisEigen >= 0) {
    return [
      { name: 'Eigenkapital', value: kaufpreisEigen, color: '#3b82f6' },
      ...nebenkostenSlices,
    ].filter(item => item.value > 0)
  }

  // Case 2: darlehen exceeds kaufpreis — scale Nebenkosten proportionally
  const scaleFactor = eigenkapital / gesamtNebenkosten
  return nebenkostenSlices
    .map(s => ({ ...s, value: s.value * scaleFactor }))
    .filter(item => item.value > 0)
}
```

- [ ] **Step 2: Run tests to verify all pass**

```bash
docker run --rm -v "$(pwd)":/app -w /app node:26.3.0-alpine sh -c "npm test -- run 2>&1 | grep -E 'Test Files|Tests |FAIL|ERROR'"
```

Expected:
```
Test Files  6 passed (6)
      Tests  67 passed (67)
```

(62 existing + 6 new = 68 — adjust expected count if different)

- [ ] **Step 3: Commit**

```bash
git add src/utils/calculations/investment.js src/utils/__tests__/investment.test.js
git commit -m "feat: add buildEigenkapitalPieData, remove buildKostenPieData"
```

---

### Task 3: Update Charts.jsx to use `buildEigenkapitalPieData`

**Files:**
- Modify: `src/components/Charts.jsx`

- [ ] **Step 1: Swap the import**

In `src/components/Charts.jsx`, replace:

```js
import { buildKostenPieData } from '../utils/calculations/investment'
```

with:

```js
import { buildEigenkapitalPieData } from '../utils/calculations/investment'
```

- [ ] **Step 2: Update the useMemo call and deps**

Replace the existing `kostenData` useMemo block:

```js
  // Kostenverteilung für Pie Chart
  const kostenData = useMemo(() => buildKostenPieData(state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.kaufpreis, state.berechneteNebenkosten, state.kaufnebenkosten])
```

with:

```js
  // Eigenkapital-Verteilung für Pie Chart
  const kostenData = useMemo(() => buildEigenkapitalPieData(state),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.kaufpreis, state.gesamtDarlehen, state.berechneteNebenkosten, state.kaufnebenkosten])
```

- [ ] **Step 3: Update the tile title and add empty-state**

Find the pie chart card JSX (look for `"Investitionskosten-Verteilung"`). Replace the entire card content:

```jsx
        {/* Eigenkapital-Verteilung */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Eigenkapital-Verteilung
          </h3>
          <div className="h-80">
            {kostenData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Vollständig fremdfinanziert
              </div>
            ) : (
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
            )}
          </div>
        </div>
```

- [ ] **Step 4: Run tests and lint**

```bash
docker run --rm -v "$(pwd)":/app -w /app node:26.3.0-alpine sh -c "npm test -- run 2>&1 | grep -E 'Test Files|Tests |FAIL|ERROR' && npm run lint 2>&1 | grep -v 'npm notice'"
```

Expected: all tests pass, 0 lint warnings/errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/Charts.jsx
git commit -m "feat: replace Investitionskosten pie with Eigenkapital-Verteilung chart"
```
