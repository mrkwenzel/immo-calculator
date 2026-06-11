# Spec: Eigenkapital-Verteilung Pie Chart

**Date:** 2026-06-11

## Summary

Replace the current "Investitionskosten-Verteilung" pie chart (which shows kaufpreis + all Nebenkosten as absolute slices) with an "Eigenkapital-Verteilung" chart. The new chart shows only the equity actually deployed: how much is bare cash into the purchase price vs. each Nebenkosten category.

## Motivation

The old chart showed the full investment including financed amounts, making it misleading. An investor cares about where their own money went, not where bank money went.

## Data Model

### New function: `buildEigenkapitalPieData(state)`

Replaces `buildKostenPieData` in `src/utils/calculations/investment.js`.

**Inputs from state:**
- `state.kaufpreis` (string or number — parse with parseFloat)
- `state.gesamtDarlehen` (number, already computed by calculateFinancing)
- `state.berechneteNebenkosten` (object: makler, notar, grunderwerbssteuer, sonstige)
- fallback: `state.kaufnebenkosten` if berechneteNebenkosten absent

**Computation:**

```
kaufpreis        = parseFloat(state.kaufpreis) || 0
gesamtDarlehen   = state.gesamtDarlehen || 0
nebenkosten      = state.berechneteNebenkosten || state.kaufnebenkosten || {}

gesamtNebenkosten = sum of all nebenkosten values
gesamtinvestition = kaufpreis + gesamtNebenkosten
eigenkapital      = gesamtinvestition - gesamtDarlehen
kaufpreisEigen    = kaufpreis - gesamtDarlehen
```

**Case 1 — Normal (kaufpreisEigen >= 0):**

Slices:
- `{ name: 'Eigenkapital', value: kaufpreisEigen, color: '#3b82f6' }`
- Each nebenkosten key with value > 0 at full value

**Case 2 — Overfinanced kaufpreis (kaufpreisEigen < 0, eigenkapital > 0):**

The loans exceed kaufpreis but don't cover full investment. The remaining equity sits entirely in the Nebenkosten portion. Scale each Nebenkosten slice proportionally:

```
scaleFactor = (gesamtNebenkosten + kaufpreisEigen) / gesamtNebenkosten
            = eigenkapital / gesamtNebenkosten
```

Slices:
- `Eigenkapital` slice: dropped (value would be 0 or negative)
- Each nebenkosten key: `original * scaleFactor`, filter out if ≤ 0

**Case 3 — Fully overfinanced (eigenkapital <= 0):**

Return empty array. The chart renders an empty state message: "Vollständig fremdfinanziert".

**Filter:** always `.filter(item => item.value > 0)` after all adjustments.

## Nebenkosten slice colors (unchanged)

| Key                  | Name                  | Color     |
|----------------------|-----------------------|-----------|
| makler               | Makler                | `#ef4444` |
| notar                | Notar                 | `#f59e0b` |
| grunderwerbssteuer   | Grunderwerbssteuer    | `#10b981` |
| sonstige             | Sonstige              | `#8b5cf6` |

## UI Changes

- Tile title: `"Investitionskosten-Verteilung"` → `"Eigenkapital-Verteilung"`
- When `kostenData` is empty: show centered text `"Vollständig fremdfinanziert"` instead of empty pie
- Pie label format unchanged: `${name} ${(percent * 100).toFixed(1)}%`
- Tooltip unchanged: absolute euro value

## Chart component

`Charts.jsx`: replace `buildKostenPieData` import and call with `buildEigenkapitalPieData`. Update `useMemo` deps to include `state.gesamtDarlehen`.

## Testing

In `src/utils/__tests__/investment.test.js`, add `describe('buildEigenkapitalPieData')` with cases:

1. Normal case (kaufpreis eigen > 0): all 5 slices present, Eigenkapital = kaufpreis - darlehen
2. Kaufpreis overfinanced (loans > kaufpreis but < gesamtinvestition): no Eigenkapital slice, Nebenkosten scaled proportionally, sum of slice values = eigenkapital
3. Fully overfinanced (eigenkapital <= 0): returns empty array
4. String kaufpreis (InputField path): Eigenkapital value is numeric
5. Zero Nebenkosten item filtered out even after scaling

## Files Changed

- `src/utils/calculations/investment.js` — add `buildEigenkapitalPieData`, keep `buildKostenPieData` (used nowhere else after this, can be removed)
- `src/utils/__tests__/investment.test.js` — new test suite
- `src/components/Charts.jsx` — swap import/call, update title, add empty state
