import { describe, it, expect } from 'vitest'
import { calculateFinancing } from '../calculations/financing.js'

describe('calculateFinancing', () => {
    it('calculates single percentage-based loan correctly', () => {
        const state = {
            kaufpreis: 200000,
            finanzierung: [
                { darlehensbetrag: 80, modus: 'prozent', zinssatz: 4, tilgung: 2, includeInCashflow: true },
                { darlehensbetrag: 0, modus: 'prozent', zinssatz: 3.5, tilgung: 2, includeInCashflow: true },
                { darlehensbetrag: 0, modus: 'prozent', zinssatz: 3.5, tilgung: 2, includeInCashflow: true },
            ]
        }
        const result = calculateFinancing(state)
        expect(result.gesamtDarlehen).toBe(160000)
        // 160000 * 0.06 / 12 = 800
        expect(result.monatlicherKapitaldienst).toBeCloseTo(800, 1)
        expect(result.kapitaldienstRelevantForCashflow).toBeCloseTo(800, 1)
    })

    it('calculates multi-loan correctly', () => {
        const state = {
            kaufpreis: 200000,
            finanzierung: [
                { darlehensbetrag: 80, modus: 'prozent', zinssatz: 4, tilgung: 2, includeInCashflow: true },
                { darlehensbetrag: 20000, modus: 'absolut', zinssatz: 5, tilgung: 5, includeInCashflow: true },
                { darlehensbetrag: 0, modus: 'prozent', zinssatz: 3.5, tilgung: 2, includeInCashflow: true },
            ]
        }
        const result = calculateFinancing(state)
        expect(result.gesamtDarlehen).toBe(180000)
        expect(result.monatlicherKapitaldienst).toBeCloseTo(966.67, 1)
    })

    it('excludes loans from cashflow when includeInCashflow is false', () => {
        const state = {
            kaufpreis: 200000,
            finanzierung: [
                { darlehensbetrag: 100000, modus: 'absolut', zinssatz: 3, tilgung: 1, includeInCashflow: true },
                { darlehensbetrag: 50000, modus: 'absolut', zinssatz: 3, tilgung: 1, includeInCashflow: false },
                { darlehensbetrag: 0, modus: 'prozent', zinssatz: 3.5, tilgung: 2, includeInCashflow: true },
            ]
        }
        const result = calculateFinancing(state)
        // only first loan counts for cashflow: 100000 * 0.04 / 12 = 333.33
        expect(result.kapitaldienstRelevantForCashflow).toBeCloseTo(333.33, 1)
        expect(result.monatlicherKapitaldienst).toBeCloseTo(500, 1)
    })

    it('always returns exactly 3 loans', () => {
        const state = { kaufpreis: 100000, finanzierung: [] }
        const result = calculateFinancing(state)
        expect(result.berechneteFinanzierung.length).toBe(3)
    })

    it('handles null finanzierung gracefully', () => {
        const state = { kaufpreis: 100000, finanzierung: null }
        const result = calculateFinancing(state)
        expect(result.berechneteFinanzierung.length).toBe(3)
    })

    it('handles missing kaufpreis gracefully (defaults to 0)', () => {
        const state = {
            finanzierung: [
                { darlehensbetrag: 80, modus: 'prozent', zinssatz: 4, tilgung: 2, includeInCashflow: true },
            ]
        }
        const result = calculateFinancing(state)
        // 80% of 0 = 0
        expect(result.gesamtDarlehen).toBe(0)
    })

    it('handles legacy object finanzierung (non-array) via migration', () => {
        const state = {
            kaufpreis: 100000,
            finanzierung: { darlehensbetrag: 50000, modus: 'absolut', zinssatz: 3, tilgung: 1, includeInCashflow: true }
        }
        const result = calculateFinancing(state)
        expect(result.berechneteFinanzierung.length).toBe(3)
        expect(result.berechneteFinanzierung[0].betrag).toBe(50000)
    })

    it('trims finanzierung arrays longer than 3 loans to exactly 3', () => {
        const state = {
            kaufpreis: 100000,
            finanzierung: [
                { darlehensbetrag: 10000, modus: 'absolut', zinssatz: 3, tilgung: 1 },
                { darlehensbetrag: 10000, modus: 'absolut', zinssatz: 3, tilgung: 1 },
                { darlehensbetrag: 10000, modus: 'absolut', zinssatz: 3, tilgung: 1 },
                { darlehensbetrag: 10000, modus: 'absolut', zinssatz: 3, tilgung: 1 },
            ]
        }
        const result = calculateFinancing(state)
        expect(result.berechneteFinanzierung.length).toBe(3)
        expect(result.gesamtDarlehen).toBe(30000)
    })

    it('handles loans with missing zinssatz/tilgung (defaults to 0)', () => {
        const state = {
            kaufpreis: 100000,
            finanzierung: [
                { darlehensbetrag: 50000, modus: 'absolut' }, // no zinssatz, no tilgung
            ]
        }
        const result = calculateFinancing(state)
        expect(result.berechneteFinanzierung[0].betrag).toBe(50000)
        expect(result.berechneteFinanzierung[0].rate).toBe(0) // 0% annuity = 0 rate
    })
})
