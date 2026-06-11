/**
 * Shared cashflow projection calculation.
 * Used by both CashflowAnalysis and Charts to ensure consistent numbers.
 *
 * @param {Object} state - The full calculation state
 * @param {number} years - Projection period in years
 * @param {number} mietSteigerung - Annual rent increase in percent
 * @param {number} kostenSteigerung - Annual cost increase in percent
 * @param {number|null} startYear - Calendar year of possession (e.g. 2026), or null
 * @returns {Array} Array of yearly projection objects
 */
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
