import { describe, it, expect } from 'vitest'
import { calculateInvestment } from '../calculations/investment.js'

describe('calculateInvestment', () => {
    it('calculates total investment with absolute costs', () => {
        const state = {
            kaufpreis: 100000,
            kaufnebenkosten: { makler: 1000, notar: 500, grunderwerbssteuer: 0, sonstige: 0 },
            nebenkostenModus: { makler: 'absolut', notar: 'absolut', grunderwerbssteuer: 'absolut', sonstige: 'absolut' },
            wohnflaeche: 60
        }
        const result = calculateInvestment(state)
        expect(result.gesamtinvestition).toBe(101500)
        expect(result.kaufpreisProQm).toBe(100000 / 60)
    })

    it('calculates total investment with percentage costs', () => {
        const state = {
            kaufpreis: 100000,
            nebenkostenProzentual: { makler: 3, notar: 1.5, grunderwerbssteuer: 5, sonstige: 0 },
            nebenkostenModus: { makler: 'prozent', notar: 'prozent', grunderwerbssteuer: 'prozent', sonstige: 'absolut' },
            kaufnebenkosten: { makler: 0, notar: 0, grunderwerbssteuer: 0, sonstige: 500 },
            wohnflaeche: 60
        }
        const result = calculateInvestment(state)
        expect(result.gesamtnebenkosten).toBe(10000)
        expect(result.gesamtinvestition).toBe(110000)
    })

    it('handles zero wohnflaeche safely', () => {
        const state = {
            kaufpreis: 100000,
            kaufnebenkosten: { makler: 0, notar: 0, grunderwerbssteuer: 0, sonstige: 0 },
            nebenkostenModus: { makler: 'absolut', notar: 'absolut', grunderwerbssteuer: 'absolut', sonstige: 'absolut' },
            wohnflaeche: 0
        }
        const result = calculateInvestment(state)
        expect(result.kaufpreisProQm).toBe(0)
    })
})
