import { describe, it, expect } from 'vitest'
import { calculateInvestment, buildKostenPieData } from '../calculations/investment.js'

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

    it('handles missing kaufpreis gracefully', () => {
        const state = {
            kaufnebenkosten: { makler: 1000, notar: 0, grunderwerbssteuer: 0, sonstige: 0 },
            nebenkostenModus: { makler: 'absolut', notar: 'absolut', grunderwerbssteuer: 'absolut', sonstige: 'absolut' },
            wohnflaeche: 60
        }
        const result = calculateInvestment(state)
        expect(result.gesamtinvestition).toBe(1000) // 0 kaufpreis + 1000 absolute makler
        expect(result.kaufpreisProQm).toBe(0)
    })

    it('handles missing kaufnebenkosten and modus gracefully', () => {
        const state = { kaufpreis: 100000, wohnflaeche: 50 }
        const result = calculateInvestment(state)
        expect(result.gesamtnebenkosten).toBe(0)
        expect(result.gesamtinvestition).toBe(100000)
    })

    it('handles missing nebenkostenProzentual entry gracefully (falls back to 0)', () => {
        const state = {
            kaufpreis: 100000,
            kaufnebenkosten: { makler: 0, notar: 0, grunderwerbssteuer: 0, sonstige: 0 },
            nebenkostenModus: { makler: 'prozent', notar: 'absolut', grunderwerbssteuer: 'absolut', sonstige: 'absolut' },
            nebenkostenProzentual: {}, // missing 'makler' key — should default to 0
            wohnflaeche: 60
        }
        const result = calculateInvestment(state)
        expect(result.berechneteNebenkosten.makler).toBe(0)
    })
})

describe('buildKostenPieData', () => {
    it('includes kaufpreis as a numeric value when stored as string (InputField passes strings)', () => {
        const state = {
            kaufpreis: '250000', // InputField stores raw string from e.target.value
            berechneteNebenkosten: { makler: 3750, notar: 1500, grunderwerbssteuer: 12500, sonstige: 0 }
        }
        const data = buildKostenPieData(state)
        const kaufpreisEntry = data.find(d => d.name === 'Kaufpreis')
        expect(kaufpreisEntry).toBeDefined()
        expect(kaufpreisEntry.value).toBe(250000)
    })

    it('excludes items with value 0 from the pie', () => {
        const state = {
            kaufpreis: 100000,
            berechneteNebenkosten: { makler: 0, notar: 500, grunderwerbssteuer: 0, sonstige: 0 }
        }
        const data = buildKostenPieData(state)
        expect(data.find(d => d.name === 'Makler')).toBeUndefined()
        expect(data.find(d => d.name === 'Notar')).toBeDefined()
    })

    it('falls back to kaufnebenkosten when berechneteNebenkosten is absent', () => {
        const state = {
            kaufpreis: 200000,
            kaufnebenkosten: { makler: 5000, notar: 2000, grunderwerbssteuer: 10000, sonstige: 0 }
        }
        const data = buildKostenPieData(state)
        expect(data.find(d => d.name === 'Makler').value).toBe(5000)
    })
})
