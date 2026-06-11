import { describe, it, expect } from 'vitest'
import { calculateCashflowProjection, calculateCashflowSincePossession } from '../cashflowProjection.js'

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
