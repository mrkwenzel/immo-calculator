/**
 * Shared cashflow projection calculation.
 * Used by both CashflowAnalysis and Charts to ensure consistent numbers.
 *
 * @param {Object} state - The full calculation state
 * @param {number} years - Projection period in years
 * @param {number} mietSteigerung - Annual rent increase in percent
 * @param {number} kostenSteigerung - Annual cost increase in percent
 * @returns {Array} Array of yearly projection objects
 */
export function calculateCashflowProjection(state, years, mietSteigerung, kostenSteigerung) {
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

    projection.push({
      year,
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
