export function calculateCashflow(state, finanzierungResult, investmentResult) {
  const nettokaltmiete = parseFloat(state.nettokaltmiete) || 0
  const stellplatzmiete = parseFloat(state.stellplatzmiete) || 0
  const umlagefaehig = parseFloat(state.umlagefaehigeKosten) || 0
  const nichtUmlagefaehig = parseFloat(state.nichtUmlagefaehigeKosten) || 0

  const monatlicheMiete = nettokaltmiete + stellplatzmiete
  const jahresmiete = monatlicheMiete * 12
  const hausgeld = umlagefaehig + nichtUmlagefaehig
  const hausgeldQuote = hausgeld > 0 ? (umlagefaehig / hausgeld) * 100 : 0

  const jahreskosten = nichtUmlagefaehig * 12
  const nettoJahresmiete = jahresmiete - jahreskosten

  const gesamtinvestition = investmentResult?.gesamtinvestition || 0
  const bruttomietrendite = gesamtinvestition > 0 ? (jahresmiete / gesamtinvestition) * 100 : 0
  const nettomietrendite = gesamtinvestition > 0 ? (nettoJahresmiete / gesamtinvestition) * 100 : 0

  const monatlicheCashflow = monatlicheMiete - nichtUmlagefaehig
  const kapitaldienstRelevantForCashflow = finanzierungResult?.kapitaldienstRelevantForCashflow || 0
  const cashflowNachBank = monatlicheCashflow - kapitaldienstRelevantForCashflow

  const gesamtDarlehen = finanzierungResult?.gesamtDarlehen || 0
  const eigenkapital = gesamtinvestition - gesamtDarlehen
  const eigenkapitalRendite = eigenkapital > 0 ? ((cashflowNachBank * 12) / eigenkapital) * 100 : 0

  const wohnflaeche = parseFloat(state.wohnflaeche) || 0
  const mieteProQm = wohnflaeche > 0 ? nettokaltmiete / wohnflaeche : 0
  const hausgeldProQm = wohnflaeche > 0 ? hausgeld / wohnflaeche : 0
  const nichtUmlagefaehigProQm = wohnflaeche > 0 ? nichtUmlagefaehig / wohnflaeche : 0
  const umlagefaehigProQm = wohnflaeche > 0 ? umlagefaehig / wohnflaeche : 0

  return {
    monatlicheMiete,
    monatlicheCashflow,
    cashflowNachBank,
    eigenkapital,
    eigenkapitalRendite,
    bruttomietrendite,
    nettomietrendite,
    hausgeld,
    hausgeldQuote,
    mieteProQm,
    hausgeldProQm,
    nichtUmlagefaehigProQm,
    umlagefaehigProQm,
  }
}
