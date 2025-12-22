import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CalculationContext = createContext()

const STORAGE_KEY = 'immo-calculator-data'

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

  // Mietdaten
  nettokaltmiete: 0,
  warmmiete: 0,
  bewirtschaftungskosten: 0,

  // Berechnete Werte
  gesamtinvestition: 0,
  kaufpreisProQm: 0,
  bruttomietrendite: 0,
  nettomietrendite: 0,
  monatlicheCashflow: 0
}

function calculationReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_FIELD':
      const newState = {
        ...state,
        [action.field]: action.value
      }
      return calculateDerivedValues(newState)

    case 'UPDATE_NEBENKOSTEN':
      const newNebenkosten = {
        ...state.kaufnebenkosten,
        [action.field]: action.value
      }
      const stateWithNebenkosten = {
        ...state,
        kaufnebenkosten: newNebenkosten
      }
      return calculateDerivedValues(stateWithNebenkosten)

    case 'UPDATE_NEBENKOSTEN_PROZENT':
      const newNebenkostenProzent = {
        ...state.nebenkostenProzentual,
        [action.field]: action.value
      }
      const stateWithNebenkostenProzent = {
        ...state,
        nebenkostenProzentual: newNebenkostenProzent
      }
      return calculateDerivedValues(stateWithNebenkostenProzent)

    case 'UPDATE_NEBENKOSTEN_MODUS':
      const newNebenkostenModus = {
        ...state.nebenkostenModus,
        [action.field]: action.value
      }
      const stateWithModus = {
        ...state,
        nebenkostenModus: newNebenkostenModus
      }
      return calculateDerivedValues(stateWithModus)

    case 'RESET_STATE':
      return calculateDerivedValues(defaultState)

    default:
      return state
  }
}

export function calculateDerivedValues(state) {
  // Berechne die tatsächlichen Nebenkosten basierend auf dem gewählten Modus
  const actualNebenkosten = {}
  const kaufpreis = parseFloat(state.kaufpreis) || 0

  Object.keys(state.kaufnebenkosten).forEach(key => {
    if (state.nebenkostenModus[key] === 'prozent') {
      // Prozentuale Berechnung
      const prozent = parseFloat(state.nebenkostenProzentual[key]) || 0
      actualNebenkosten[key] = (kaufpreis * prozent) / 100
    } else {
      // Absolute Berechnung
      actualNebenkosten[key] = parseFloat(state.kaufnebenkosten[key]) || 0
    }
  })

  const gesamtnebenkosten = Object.values(actualNebenkosten).reduce((sum, val) => sum + val, 0)
  const gesamtinvestition = kaufpreis + gesamtnebenkosten
  const kaufpreisProQm = state.wohnflaeche > 0 ? (parseFloat(state.kaufpreis) || 0) / (parseFloat(state.wohnflaeche) || 1) : 0

  const jahresmiete = (parseFloat(state.nettokaltmiete) || 0) * 12
  const bruttomietrendite = gesamtinvestition > 0 ? (jahresmiete / gesamtinvestition) * 100 : 0

  const jahresbewirtschaftung = (parseFloat(state.bewirtschaftungskosten) || 0) * 12
  const nettoJahresmiete = jahresmiete - jahresbewirtschaftung
  const nettomietrendite = gesamtinvestition > 0 ? (nettoJahresmiete / gesamtinvestition) * 100 : 0

  const monatlicheCashflow = (parseFloat(state.nettokaltmiete) || 0) - (parseFloat(state.bewirtschaftungskosten) || 0)

  return {
    ...state,
    gesamtinvestition,
    kaufpreisProQm,
    bruttomietrendite,
    nettomietrendite,
    monatlicheCashflow,
    // Speichere die berechneten Nebenkosten für die Anzeige
    berechneteNebenkosten: actualNebenkosten
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
        return calculateDerivedValues(parsed)
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error)
    }
    return calculateDerivedValues(defaultState)
  }

  const [state, dispatch] = useReducer(calculationReducer, getInitialState())

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
      }
    } catch (error) {
      console.error('Error saving state to localStorage:', error)
    }
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

  const clearData = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY)
      }
      // Reset to default state
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