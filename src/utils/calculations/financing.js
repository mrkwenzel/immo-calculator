const defaultLoan = { darlehensbetrag: 0, modus: 'prozent', zinssatz: 3.5, tilgung: 2.0, includeInCashflow: true }

export function calculateFinancing(state) {
  const kaufpreis = parseFloat(state.kaufpreis) || 0
  let loans = state.finanzierung

  if (!Array.isArray(loans)) {
    loans = loans ? [loans, { ...defaultLoan }, { ...defaultLoan }] : [{ ...defaultLoan }, { ...defaultLoan }, { ...defaultLoan }]
  }
  while (loans.length < 3) loans.push({ ...defaultLoan })
  if (loans.length > 3) loans = loans.slice(0, 3)

  let gesamtDarlehen = 0
  let darlehenRelevantForCashflow = 0
  let monatlicherKapitaldienst = 0
  let kapitaldienstRelevantForCashflow = 0
  const berechneteFinanzierung = []

  loans.forEach(loan => {
    const inputAmount = parseFloat(loan.darlehensbetrag) || 0
    const loanAmount = loan.modus === 'prozent' ? (kaufpreis * inputAmount) / 100 : inputAmount
    const zinssatz = parseFloat(loan.zinssatz) || 0
    const tilgung = parseFloat(loan.tilgung) || 0
    const mtlRate = (loanAmount * (zinssatz + tilgung)) / 100 / 12

    gesamtDarlehen += loanAmount
    monatlicherKapitaldienst += mtlRate

    if (loan.includeInCashflow !== false) {
      kapitaldienstRelevantForCashflow += mtlRate
      darlehenRelevantForCashflow += loanAmount
    }

    berechneteFinanzierung.push({
      betrag: loanAmount,
      rate: mtlRate,
      zins: zinssatz,
      tilgung,
      includeInCashflow: loan.includeInCashflow !== false,
    })
  })

  return {
    finanzierung: loans,
    berechneteFinanzierung,
    gesamtDarlehen,
    berechnetesDarlehen: gesamtDarlehen,
    darlehenRelevantForCashflow,
    monatlicherKapitaldienst,
    kapitaldienstRelevantForCashflow,
  }
}
