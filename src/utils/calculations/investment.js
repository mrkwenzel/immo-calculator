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
 * Builds the data array for the Investitionskosten-Verteilung pie chart.
 * Ensures kaufpreis is parsed as a number so Recharts can compute percentages.
 */
export function buildKostenPieData(state) {
  const kaufpreis = parseFloat(state.kaufpreis) || 0
  const nebenkosten = state.berechneteNebenkosten || state.kaufnebenkosten || {}
  return [
    { name: 'Kaufpreis', value: kaufpreis, color: '#3b82f6' },
    { name: 'Makler', value: nebenkosten.makler || 0, color: '#ef4444' },
    { name: 'Notar', value: nebenkosten.notar || 0, color: '#f59e0b' },
    { name: 'Grunderwerbssteuer', value: nebenkosten.grunderwerbssteuer || 0, color: '#10b981' },
    { name: 'Sonstige', value: nebenkosten.sonstige || 0, color: '#8b5cf6' },
  ].filter(item => item.value > 0)
}
