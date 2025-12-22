import { describe, it, expect } from 'vitest'
import { calculateDerivedValues } from '../useCalculation'

describe('calculateDerivedValues', () => {
    const defaultState = {
        kaufpreis: 0,
        kaufnebenkosten: {
            makler: 0,
            notar: 0,
            grunderwerbssteuer: 0,
            sonstige: 0
        },
        nebenkostenProzentual: {
            makler: 0,
            notar: 0,
            grunderwerbssteuer: 0,
            sonstige: 0
        },
        nebenkostenModus: {
            makler: 'absolut',
            notar: 'absolut',
            grunderwerbssteuer: 'absolut',
            sonstige: 'absolut'
        },
        wohnflaeche: 0,
        nettokaltmiete: 0,
        stellplatzmiete: 0,
        umlagefaehigeKosten: 0,
        nichtUmlagefaehigeKosten: 0,
        finanzierung: [] // Will default to 3 empty loans in calculateDerivedValues
    }

    it('calculates total investment correctly with absolute costs', () => {
        const state = {
            ...defaultState,
            kaufpreis: 100000,
            kaufnebenkosten: {
                makler: 1000,
                notar: 500,
                grunderwerbssteuer: 0,
                sonstige: 0
            }
        }

        const result = calculateDerivedValues(state)
        expect(result.gesamtinvestition).toBe(101500)
        expect(result.berechneteNebenkosten.makler).toBe(1000)
    })

    it('calculates yields and cashflow correctly', () => {
        const state = {
            ...defaultState,
            kaufpreis: 100000,
            kaufnebenkosten: { makler: 0, notar: 0, grunderwerbssteuer: 0, sonstige: 0 },
            nettokaltmiete: 500,
            stellplatzmiete: 50,
            nichtUmlagefaehigeKosten: 100
        }

        const result = calculateDerivedValues(state)
        expect(result.bruttomietrendite).toBeCloseTo(6.6)
        expect(result.nettomietrendite).toBeCloseTo(5.4)
        expect(result.monatlicheCashflow).toBe(450)
    })

    it('calculates multi-loan financing correctly', () => {
        const state = {
            ...defaultState,
            kaufpreis: 200000,
            kaufnebenkosten: { makler: 0, notar: 0, grunderwerbssteuer: 0, sonstige: 0 },
            nettokaltmiete: 1000,
            finanzierung: [
                { darlehensbetrag: 80, modus: 'prozent', zinssatz: 4, tilgung: 2 }, // 160.000, index 0
                { darlehensbetrag: 20000, modus: 'absolut', zinssatz: 5, tilgung: 5 } // 20.000, index 1
            ]
        }

        const result = calculateDerivedValues(state)

        // Loan 1: 160.000 * 0.06 / 12 = 800
        // Loan 2: 20.000 * 0.10 / 12 = 166.66...
        // Total Capital Service: 966.66...

        expect(result.gesamtDarlehen).toBe(180000)
        expect(result.monatlicherKapitaldienst).toBeCloseTo(966.67, 1)
        expect(result.cashflowNachBank).toBeCloseTo(1000 - 966.67, 1)

        // Eigenkapital: 200.000 - 180.000 = 20.000
        // EK-Rendite: (33.33 * 12) / 20.000 = 2%
        expect(result.eigenkapitalRendite).toBeCloseTo(2, 1)

        expect(result.berechneteFinanzierung.length).toBe(3)
        expect(result.berechneteFinanzierung[0].betrag).toBe(160000)
        expect(result.berechneteFinanzierung[1].betrag).toBe(20000)
    })

    it('handles zero division safely', () => {
        const state = {
            ...defaultState,
            kaufpreis: 100000,
            wohnflaeche: 0
        }

        const result = calculateDerivedValues(state)
        expect(result.kaufpreisProQm).toBe(0)
    })
})
