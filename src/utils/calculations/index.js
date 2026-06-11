import { calculateInvestment } from './investment.js'
import { calculateFinancing } from './financing.js'
import { calculateCashflow } from './cashflow.js'

export function calculateDerivedValues(state) {
  const investmentResult = calculateInvestment(state)
  const financingResult = calculateFinancing(state)
  const cashflowResult = calculateCashflow(state, financingResult, investmentResult)

  return {
    ...state,
    ...investmentResult,
    ...financingResult,
    ...cashflowResult,
  }
}
