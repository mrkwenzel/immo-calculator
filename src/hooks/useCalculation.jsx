/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect } from 'react'
import { calculateDerivedValues } from '../utils/calculations/index.js'

const CalculationContext = createContext()

const STORAGE_KEY = 'immo-calculator-data'

const defaultLoan = {
  darlehensbetrag: 0,
  modus: 'prozent', // 'absolut' oder 'prozent'
  zinssatz: 3.5,
  tilgung: 2.0,
  includeInCashflow: true
}

const defaultState = {
  // Investitionsdaten
  kaufpreis: 0,
  kaufnebenkosten: {
    makler: 0,
    notar: 0,
    grunderwerbssteuer: 0,
    sonstige: 0
  },
  // Prozentuale Eingabe für Nebenkosten
  nebenkostenProzentual: {
    makler: 0,
    notar: 1.5,
    grunderwerbssteuer: 5.0,
    sonstige: 0
  },
  // Eingabemodus für Nebenkosten (absolute oder prozentuale Werte)
  nebenkostenModus: {
    makler: 'absolut', // 'absolut' oder 'prozent'
    notar: 'prozent',
    grunderwerbssteuer: 'prozent',
    sonstige: 'absolut'
  },
  wohnflaeche: 0,

  // Datumsfelder
  kaufvertragsdatum: '',        // ISO date string YYYY-MM-DD, optional
  besitzuebergangsdatum: '',    // ISO date string YYYY-MM-DD, optional

  // Mietdaten
  nettokaltmiete: 0,
  stellplatzmiete: 0,
  umlagefaehigeKosten: 0,
  nichtUmlagefaehigeKosten: 0,

  // Finanzierung (Array of 3 Loans)
  finanzierung: [
    { ...defaultLoan, darlehensbetrag: 80 }, // Loan 1 Default 80%
    { ...defaultLoan }, // Loan 2
    { ...defaultLoan }  // Loan 3
  ],

  // Berechnete Werte
  gesamtinvestition: 0,
  kaufpreisProQm: 0,
  bruttomietrendite: 0,
  nettomietrendite: 0,
  monatlicheCashflow: 0,
  hausgeld: 0,
  hausgeldQuote: 0,

  // Berechnete Finanzwerte
  berechneteFinanzierung: [], // Details per loan
  gesamtDarlehen: 0,
  monatlicherKapitaldienst: 0,
  cashflowNachBank: 0,
  eigenkapital: 0,
  eigenkapitalRendite: 0
}

function calculationReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD': {
      const newState = {
        ...state,
        [action.field]: action.value
      }
      return calculateDerivedValues(newState)
    }

    case 'UPDATE_NEBENKOSTEN': {
      const newNebenkosten = {
        ...state.kaufnebenkosten,
        [action.field]: action.value
      }
      const stateWithNebenkosten = {
        ...state,
        kaufnebenkosten: newNebenkosten
      }
      return calculateDerivedValues(stateWithNebenkosten)
    }

    case 'UPDATE_NEBENKOSTEN_PROZENT': {
      const newNebenkostenProzent = {
        ...state.nebenkostenProzentual,
        [action.field]: action.value
      }
      const stateWithNebenkostenProzent = {
        ...state,
        nebenkostenProzentual: newNebenkostenProzent
      }
      return calculateDerivedValues(stateWithNebenkostenProzent)
    }

    case 'UPDATE_NEBENKOSTEN_MODUS': {
      const newNebenkostenModus = {
        ...state.nebenkostenModus,
        [action.field]: action.value
      }
      const stateWithModus = {
        ...state,
        nebenkostenModus: newNebenkostenModus
      }
      return calculateDerivedValues(stateWithModus)
    }

    case 'UPDATE_FINANZIERUNG': {
      // action.index is required
      const loans = [...state.finanzierung]
      loans[action.index] = {
        ...loans[action.index],
        [action.field]: action.value
      }
      return calculateDerivedValues({
        ...state,
        finanzierung: loans
      })
    }

    case 'RESET_STATE':
      return calculateDerivedValues(defaultState)

    default:
      return state
  }
}

export function CalculationProvider({ children }) {
  // Load initial state from localStorage or use defaults
  const getInitialState = () => {
    try {
      const savedState = typeof window !== 'undefined'
        ? window.localStorage.getItem(STORAGE_KEY)
        : null

      if (savedState) {
        const parsed = JSON.parse(savedState)
        // Migration logic handles inside calculateDerivedValues
        return calculateDerivedValues({ ...defaultState, ...parsed })
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error)
    }
    return calculateDerivedValues(defaultState)
  }

  const [state, dispatch] = useReducer(calculationReducer, getInitialState())

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
        }
      } catch (error) {
        console.error('Error saving state to localStorage:', error)
      }
    }, 500)
    
    return () => clearTimeout(timer)
  }, [state])

  const updateField = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value })
  }

  const updateNebenkosten = (field, value) => {
    dispatch({ type: 'UPDATE_NEBENKOSTEN', field, value })
  }

  const updateNebenkostenProzent = (field, value) => {
    dispatch({ type: 'UPDATE_NEBENKOSTEN_PROZENT', field, value })
  }

  const updateNebenkostenModus = (field, value) => {
    dispatch({ type: 'UPDATE_NEBENKOSTEN_MODUS', field, value })
  }

  const updateFinanzierung = (index, field, value) => {
    dispatch({ type: 'UPDATE_FINANZIERUNG', index, field, value })
  }

  const clearData = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY)
      }
      dispatch({ type: 'RESET_STATE' })
    } catch (error) {
      console.error('Error clearing data:', error)
    }
  }

  return (
    <CalculationContext.Provider value={{
      state,
      updateField,
      updateNebenkosten,
      updateNebenkostenProzent,
      updateNebenkostenModus,
      updateFinanzierung,
      clearData
    }}>
      {children}
    </CalculationContext.Provider>
  )
}

export function useCalculation() {
  const context = useContext(CalculationContext)
  if (!context) {
    throw new Error('useCalculation must be used within a CalculationProvider')
  }
  return context
}