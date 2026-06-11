export function calculateInvestment(state) {
  const kaufpreis = parseFloat(state.kaufpreis) || 0
  const wohnflaeche = parseFloat(state.wohnflaeche) || 0
  const kaufnebenkosten = state.kaufnebenkosten || {}
  const nebenkostenModus = state.nebenkostenModus || {}
  const nebenkostenProzentual = state.nebenkostenProzentual || {}

  const actualNebenkosten = {}
  Object.keys(kaufnebenkosten).forEach(key => {
    if (nebenkostenModus[key] === 'prozent') {
      const prozent = parseFloat(nebenkostenProzentual[key]) || 0
      actualNebenkosten[key] = (kaufpreis * prozent) / 100
    } else {
      actualNebenkosten[key] = parseFloat(kaufnebenkosten[key]) || 0
    }
  })

  const gesamtnebenkosten = Object.values(actualNebenkosten).reduce((sum, val) => sum + val, 0)
  const gesamtinvestition = kaufpreis + gesamtnebenkosten
  const kaufpreisProQm = wohnflaeche > 0 ? kaufpreis / wohnflaeche : 0

  return {
    gesamtinvestition,
    gesamtnebenkosten,
    kaufpreisProQm,
    berechneteNebenkosten: actualNebenkosten,
  }
}

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
    { name: 'Makler',             value: nebenkosten.makler             || 0, color: '#ef4444' },
    { name: 'Notar',              value: nebenkosten.notar              || 0, color: '#f59e0b' },
    { name: 'Grunderwerbssteuer', value: nebenkosten.grunderwerbssteuer || 0, color: '#10b981' },
    { name: 'Sonstige',           value: nebenkosten.sonstige           || 0, color: '#8b5cf6' },
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
