import { describe, it, expect } from 'vitest'
import { calculateCashflow } from '../calculations/cashflow.js'

const baseInvestment = { gesamtinvestition: 100000 }
const baseFinancing = { kapitaldienstRelevantForCashflow: 0, gesamtDarlehen: 0 }

describe('calculateCashflow', () => {
    it('calculates operational cashflow (miete - nicht-umlagefaehig)', () => {
        const state = {
            nettokaltmiete: 500,
            stellplatzmiete: 50,
            umlagefaehigeKosten: 100,
            nichtUmlagefaehigeKosten: 100,
            wohnflaeche: 60
        }
        const result = calculateCashflow(state, baseFinancing, baseInvestment)
        expect(result.monatlicheMiete).toBe(550)
        expect(result.monatlicheCashflow).toBe(450) // 550 - 100
    })

    it('calculates cashflow after bank', () => {
        const state = {
            nettokaltmiete: 1000,
            stellplatzmiete: 0,
            umlagefaehigeKosten: 0,
            nichtUmlagefaehigeKosten: 0,
            wohnflaeche: 0
        }
        const financing = { kapitaldienstRelevantForCashflow: 800, gesamtDarlehen: 80000 }
        const investment = { gesamtinvestition: 100000 }
        const result = calculateCashflow(state, financing, investment)
        expect(result.cashflowNachBank).toBe(200) // 1000 - 800
        expect(result.eigenkapital).toBe(20000) // 100000 - 80000
    })

    it('calculates bruttomietrendite correctly', () => {
        const state = {
            nettokaltmiete: 500,
            stellplatzmiete: 0,
            umlagefaehigeKosten: 0,
            nichtUmlagefaehigeKosten: 0,
            wohnflaeche: 0
        }
        const investment = { gesamtinvestition: 100000 }
        const result = calculateCashflow(state, baseFinancing, investment)
        // (500 * 12) / 100000 * 100 = 6
        expect(result.bruttomietrendite).toBeCloseTo(6, 1)
    })

    it('calculates eigenkapitalRendite correctly', () => {
        const state = {
            nettokaltmiete: 1000,
            stellplatzmiete: 0,
            umlagefaehigeKosten: 0,
            nichtUmlagefaehigeKosten: 0,
            wohnflaeche: 0
        }
        const financing = { kapitaldienstRelevantForCashflow: 800, gesamtDarlehen: 80000 }
        const investment = { gesamtinvestition: 100000 }
        const result = calculateCashflow(state, financing, investment)
        // cashflowNachBank = 200, eigenkapital = 20000
        // EK-Rendite = (200*12)/20000*100 = 12%
        expect(result.eigenkapitalRendite).toBeCloseTo(12, 1)
    })

    it('returns zero yields when gesamtinvestition is 0', () => {
        const state = {
            nettokaltmiete: 500, stellplatzmiete: 0,
            umlagefaehigeKosten: 0, nichtUmlagefaehigeKosten: 0, wohnflaeche: 0
        }
        const result = calculateCashflow(state, baseFinancing, { gesamtinvestition: 0 })
        expect(result.bruttomietrendite).toBe(0)
        expect(result.nettomietrendite).toBe(0)
    })
})
