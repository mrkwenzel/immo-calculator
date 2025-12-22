import React from 'react'

const ResultsDisplay = ({ state }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(value || 0)
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Berechnungsergebnisse
            </h3>
            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Gesamtinvestition:</span>
                        <span className="text-xl font-bold text-primary-600">
                            {formatCurrency(state.gesamtinvestition)}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Kaufpreis + Nebenkosten
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Kaufpreis pro m²:</span>
                        <span className="text-xl font-bold text-green-600">
                            {formatCurrency(state.kaufpreisProQm)}
                        </span>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Bruttomietrendite:</span>
                        <span className="text-xl font-bold text-blue-600">
                            {(state.bruttomietrendite || 0).toFixed(2)}%
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Jahresmiete / Gesamtinvestition
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Nettomietrendite:</span>
                        <span className="text-xl font-bold text-purple-600">
                            {(state.nettomietrendite || 0).toFixed(2)}%
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Nach Bewirtschaftungskosten
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Monatlicher Cashflow:</span>
                        <span className={`text-xl font-bold ${state.monatlicheCashflow >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {formatCurrency(state.monatlicheCashflow)}
                        </span>
                    </div>
                    <div className="text-sm text-gray-500">
                        Miete - Bewirtschaftungskosten
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResultsDisplay
