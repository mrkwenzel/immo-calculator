import { describe, it, expect } from 'vitest'
import { calculateInvestment, buildEigenkapitalPieData } from '../calculations/investment.js'

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

describe('buildEigenkapitalPieData', () => {
    it('normal case: Eigenkapital slice = kaufpreis - darlehen, Nebenkosten at full value', () => {
        const state = {
            kaufpreis: 200000,
            darlehenRelevantForCashflow: 160000,
            berechneteNebenkosten: { makler: 6000, notar: 2000, grunderwerbssteuer: 10000, sonstige: 0 }
        }
        const data = buildEigenkapitalPieData(state)
        const ek = data.find(d => d.name === 'Eigenkapital')
        expect(ek).toBeDefined()
        expect(ek.value).toBe(40000) // 200000 - 160000
        const makler = data.find(d => d.name === 'Makler')
        expect(makler.value).toBe(6000)
        const notar = data.find(d => d.name === 'Notar')
        expect(notar.value).toBe(2000)
        const grest = data.find(d => d.name === 'Grunderwerbssteuer')
        expect(grest.value).toBe(10000)
        // sonstige = 0, should be filtered out
        expect(data.find(d => d.name === 'Sonstige')).toBeUndefined()
    })

    it('non-cashflow darlehen are excluded from eigenkapital deduction', () => {
        // 160k cashflow loan + 20k non-cashflow loan = 180k gesamtDarlehen
        // but eigenkapital should only deduct the 160k cashflow loan
        const state = {
            kaufpreis: 200000,
            darlehenRelevantForCashflow: 160000, // only this counts
            berechneteNebenkosten: { makler: 6000, notar: 2000, grunderwerbssteuer: 10000, sonstige: 0 }
        }
        const data = buildEigenkapitalPieData(state)
        const ek = data.find(d => d.name === 'Eigenkapital')
        expect(ek.value).toBe(40000) // 200000 - 160000 (not 200000 - 180000)
    })

    it('overfinanced kaufpreis: no Eigenkapital slice, Nebenkosten scaled proportionally', () => {
        // kaufpreis=200k, darlehen=210k → kaufpreisEigen=-10k
        // nebenkosten total=20k, eigenkapital=10k → scaleFactor=0.5
        const state = {
            kaufpreis: 200000,
            darlehenRelevantForCashflow: 210000,
            berechneteNebenkosten: { makler: 6000, notar: 2000, grunderwerbssteuer: 10000, sonstige: 2000 }
        }
        const data = buildEigenkapitalPieData(state)
        expect(data.find(d => d.name === 'Eigenkapital')).toBeUndefined()
        const makler = data.find(d => d.name === 'Makler')
        expect(makler.value).toBeCloseTo(3000) // 6000 * 0.5
        const notar = data.find(d => d.name === 'Notar')
        expect(notar.value).toBeCloseTo(1000) // 2000 * 0.5
        const grest = data.find(d => d.name === 'Grunderwerbssteuer')
        expect(grest.value).toBeCloseTo(5000) // 10000 * 0.5
        const sonstige = data.find(d => d.name === 'Sonstige')
        expect(sonstige.value).toBeCloseTo(1000) // 2000 * 0.5
        // total equity check
        const total = data.reduce((sum, d) => sum + d.value, 0)
        expect(total).toBeCloseTo(10000) // eigenkapital
    })

    it('fully overfinanced (eigenkapital <= 0): returns empty array', () => {
        const state = {
            kaufpreis: 200000,
            darlehenRelevantForCashflow: 230000,
            berechneteNebenkosten: { makler: 6000, notar: 2000, grunderwerbssteuer: 10000, sonstige: 2000 }
        }
        const data = buildEigenkapitalPieData(state)
        expect(data).toEqual([])
    })

    it('string kaufpreis (InputField path): Eigenkapital value is numeric', () => {
        const state = {
            kaufpreis: '300000',
            darlehenRelevantForCashflow: 240000,
            berechneteNebenkosten: { makler: 5000, notar: 1500, grunderwerbssteuer: 15000, sonstige: 0 }
        }
        const data = buildEigenkapitalPieData(state)
        const ek = data.find(d => d.name === 'Eigenkapital')
        expect(ek.value).toBe(60000)
    })

    it('falls back to kaufnebenkosten when berechneteNebenkosten is absent', () => {
        const state = {
            kaufpreis: 150000,
            darlehenRelevantForCashflow: 100000,
            kaufnebenkosten: { makler: 3000, notar: 1000, grunderwerbssteuer: 7500, sonstige: 0 }
        }
        const data = buildEigenkapitalPieData(state)
        expect(data.find(d => d.name === 'Eigenkapital').value).toBe(50000)
        expect(data.find(d => d.name === 'Makler').value).toBe(3000)
    })

    it('eigenkapital exactly zero returns empty array', () => {
        const state = {
            kaufpreis: 200000,
            darlehenRelevantForCashflow: 220000,
            berechneteNebenkosten: { makler: 6000, notar: 2000, grunderwerbssteuer: 10000, sonstige: 2000 }
        }
        const data = buildEigenkapitalPieData(state)
        expect(data).toEqual([])
    })
})
