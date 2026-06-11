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
