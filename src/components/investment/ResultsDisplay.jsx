import React from 'react'
import { Landmark, TrendingUp } from 'lucide-react'

const ResultsDisplay = ({
    state,
    showRentDetails = false,
    showInvestmentBasics = false,
    showCashflow = false,
    showFinancing = false
}) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(value || 0)
    }

    const formatPercent = (value) => (value || 0).toFixed(2)

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ergebnisse
            </h3>
            <div className="space-y-4">
                {/* Rent per SQM details (only for Rent page) */}
                {showRentDetails && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            Miet- & Kostenkennzahlen (/m²)
                        </h4>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-blue-700 font-medium">Kaltmiete / m²:</span>
                                <span className="text-blue-900 font-bold">{state.mieteProQm.toFixed(2).replace('.', ',')} €</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-blue-700">Hausgeld / m²:</span>
                                <span className="text-blue-900">{state.hausgeldProQm.toFixed(2).replace('.', ',')} €</span>
                            </div>
                            <div className="pl-4 space-y-1">
                                <div className="flex justify-between items-center text-xs text-blue-600">
                                    <span>davon umlagefähig:</span>
                                    <span>{state.umlagefaehigProQm.toFixed(2).replace('.', ',')} €</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-blue-600">
                                    <span>nicht umlagefähig:</span>
                                    <span>{state.nichtUmlagefaehigProQm.toFixed(2).replace('.', ',')} €</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Investment Basics */}
                {showInvestmentBasics && (
                    <div className="space-y-3">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-600">Gesamtinvestition:</span>
                                <span className="font-bold text-gray-900">{formatCurrency(state.gesamtinvestition)}</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-600">Bruttomietrendite:</span>
                                <span className="font-bold text-blue-600">{formatPercent(state.bruttomietrendite)}%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>Nettomietrendite:</span>
                                <span>{formatPercent(state.nettomietrendite)}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Operating Cashflow */}
                {showCashflow && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600">Operativer Cashflow:</span>
                            <span className={`font-bold ${state.monatlicheCashflow >= 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                {formatCurrency(state.monatlicheCashflow)}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 text-right">Miete - nicht-uml. Kosten</div>
                    </div>
                )}

                {/* Financing Impact */}
                {showFinancing && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-3 text-blue-900 font-semibold border-b border-blue-200 pb-2">
                            <Landmark className="w-4 h-4" />
                            <span>Finanzierung</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-blue-700">Gesamt-Kapitaldienst:</span>
                                <span className="text-blue-900 font-semibold">{formatCurrency(state.monatlicherKapitaldienst)}</span>
                            </div>

                            {/* Breakdown of individual loans if more than one has a rate > 0 */}
                            {state.berechneteFinanzierung && state.berechneteFinanzierung.filter(f => f.rate > 0).length > 1 && (
                                <div className="pl-4 space-y-1 mt-1 border-l-2 border-blue-200">
                                    {state.berechneteFinanzierung.map((loan, idx) => loan.rate > 0 ? (
                                        <div key={idx} className="flex justify-between items-center text-xs text-blue-600">
                                            <span>Darlehen {idx + 1}:</span>
                                            <span>{formatCurrency(loan.rate)}</span>
                                        </div>
                                    ) : null)}
                                </div>
                            )}

                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-blue-200">
                                <span className="text-blue-800 font-medium">Cashflow (n. Bank):</span>
                                <span className={`font-bold text-lg ${state.cashflowNachBank >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {formatCurrency(state.cashflowNachBank)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-blue-200 mt-2">
                                <span className="text-blue-800 font-medium flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" /> EK-Rendite:
                                </span>
                                <span className="font-bold text-blue-900">{formatPercent(state.eigenkapitalRendite)}%</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResultsDisplay
