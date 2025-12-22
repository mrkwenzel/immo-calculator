import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CalculationContext = createContext()

const STORAGE_KEY = 'immo-calculator-data'

const defaultLoan = {
  darlehensbetrag: 0,
  modus: 'prozent', // 'absolut' oder 'prozent'
  zinssatz: 3.5,
  tilgung: 2.0
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

    case 'UPDATE_FINANZIERUNG':
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

  // Mietberechnung
  const nettokaltmiete = parseFloat(state.nettokaltmiete) || 0
  const stellplatzmiete = parseFloat(state.stellplatzmiete) || 0
  const monatlicheMiete = nettokaltmiete + stellplatzmiete
  const jahresmiete = monatlicheMiete * 12

  const bruttomietrendite = gesamtinvestition > 0 ? (jahresmiete / gesamtinvestition) * 100 : 0

  // Hausgeld & Kosten
  const umlagefaehig = parseFloat(state.umlagefaehigeKosten) || 0
  const nichtUmlagefaehig = parseFloat(state.nichtUmlagefaehigeKosten) || 0
  const hausgeld = umlagefaehig + nichtUmlagefaehig

  const hausgeldQuote = hausgeld > 0 ? (umlagefaehig / hausgeld) * 100 : 0

  // Cashflow Kosten
  const monatlicheKosten = nichtUmlagefaehig
  const jahreskosten = monatlicheKosten * 12

  const nettoJahresmiete = jahresmiete - jahreskosten
  const nettomietrendite = gesamtinvestition > 0 ? (nettoJahresmiete / gesamtinvestition) * 100 : 0

  const monatlicheCashflow = monatlicheMiete - monatlicheKosten

  // Pro qm Berechnungen
  const wohnflaeche = parseFloat(state.wohnflaeche) || 0
  const mieteProQm = wohnflaeche > 0 ? nettokaltmiete / wohnflaeche : 0
  const hausgeldProQm = wohnflaeche > 0 ? hausgeld / wohnflaeche : 0
  const nichtUmlagefaehigProQm = wohnflaeche > 0 ? nichtUmlagefaehig / wohnflaeche : 0
  const umlagefaehigProQm = wohnflaeche > 0 ? umlagefaehig / wohnflaeche : 0

  // Finanzierung (Multi-Loan)
  let loans = []
  if (Array.isArray(state.finanzierung)) {
    loans = state.finanzierung
  } else if (state.finanzierung) {
    // Migration: Legacy Object -> Loan 1
    loans = [state.finanzierung, { ...defaultLoan }, { ...defaultLoan }]
  } else {
    loans = defaultState.finanzierung
  }

  // Ensure 3 slots
  while (loans.length < 3) loans.push({ ...defaultLoan });
  if (loans.length > 3) loans = loans.slice(0, 3); // Limit to 3

  let gesamtDarlehen = 0
  let monatlicherKapitaldienst = 0
  const berechneteFinanzierung = []

  loans.forEach(loan => {
    const inputAmount = parseFloat(loan.darlehensbetrag) || 0
    let loanAmount = 0

    if (loan.modus === 'prozent') {
      loanAmount = (kaufpreis * inputAmount) / 100
    } else {
      loanAmount = inputAmount
    }

    const zinssatz = parseFloat(loan.zinssatz) || 0
    const tilgung = parseFloat(loan.tilgung) || 0
    const annuitaet = zinssatz + tilgung
    const jahresRate = (loanAmount * annuitaet) / 100
    const mtlRate = jahresRate / 12

    gesamtDarlehen += loanAmount
    monatlicherKapitaldienst += mtlRate

    berechneteFinanzierung.push({
      betrag: loanAmount,
      rate: mtlRate,
      zins: zinssatz,
      tilgung: tilgung
    })
  })

  const cashflowNachBank = monatlicheCashflow - monatlicherKapitaldienst

  const eigenkapital = gesamtinvestition - gesamtDarlehen
  const eigenkapitalRendite = eigenkapital > 0 ? ((cashflowNachBank * 12) / eigenkapital) * 100 : 0

  return {
    ...state,
    finanzierung: loans,
    berechneteFinanzierung, // Array of results
    berechnetesDarlehen: gesamtDarlehen, // For backward compatibility hook (renamed conceptually but kept key?) Actually used 'berechnetesDarlehen' in Charts/Forms. I'll map total to it.
    gesamtDarlehen,
    monatlicherKapitaldienst,
    cashflowNachBank,
    eigenkapital,
    eigenkapitalRendite,
    gesamtinvestition,
    kaufpreisProQm,
    bruttomietrendite,
    nettomietrendite,
    monatlicheMiete,
    monatlicheCashflow,
    hausgeld,
    hausgeldQuote,
    mieteProQm,
    hausgeldProQm,
    nichtUmlagefaehigProQm,
    umlagefaehigProQm,
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