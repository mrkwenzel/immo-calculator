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
        bewirtschaftungskosten: 0
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

    it('calculates total investment correctly with percentage costs', () => {
        const state = {
            ...defaultState,
            kaufpreis: 100000,
            nebenkostenModus: {
                ...defaultState.nebenkostenModus,
                makler: 'prozent'
            },
            nebenkostenProzentual: {
                ...defaultState.nebenkostenProzentual,
                makler: 3
            }
        }

        const result = calculateDerivedValues(state)
        // 3% of 100,000 is 3,000
        expect(result.berechneteNebenkosten.makler).toBe(3000)
        expect(result.gesamtinvestition).toBe(103000)
    })

    it('calculates yields correctly', () => {
        const state = {
            ...defaultState,
            kaufpreis: 100000,
            kaufnebenkosten: { makler: 0, notar: 0, grunderwerbssteuer: 0, sonstige: 0 },
            nettokaltmiete: 500, // 6000 per year
            bewirtschaftungskosten: 100 // 1200 per year
        }

        const result = calculateDerivedValues(state)

        // Gross yield: (6000 / 100000) * 100 = 6%
        expect(result.bruttomietrendite).toBe(6)

        // Net yield: ((6000 - 1200) / 100000) * 100 = 4.8%
        expect(result.nettomietrendite).toBe(4.8)

        // Monthly cashflow: 500 - 100 = 400
        expect(result.monatlicheCashflow).toBe(400)
    })

    it('calculates price per sqm', () => {
        const state = {
            ...defaultState,
            kaufpreis: 100000,
            wohnflaeche: 50
        }

        const result = calculateDerivedValues(state)
        expect(result.kaufpreisProQm).toBe(2000)
    })

    it('handles zero division safely', () => {
        const state = {
            ...defaultState,
            kaufpreis: 100000,
            wohnflaeche: 0
        }

        const result = calculateDerivedValues(state)
        expect(result.kaufpreisProQm).toBe(0)

        const state2 = {
            ...defaultState,
            kaufpreis: 0,
            nettokaltmiete: 1000
        }
        const result2 = calculateDerivedValues(state2)
        expect(result2.bruttomietrendite).toBe(0)
    })
})
