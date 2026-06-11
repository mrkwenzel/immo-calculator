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
})
