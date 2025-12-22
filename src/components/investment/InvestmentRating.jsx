import React from 'react'

const InvestmentRating = ({ bruttomietrendite, monatlicheCashflow }) => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bewertung
            </h3>
            <div className="space-y-3">
                {bruttomietrendite >= 5 ? (
                    <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
                        <p className="text-green-800 font-medium">
                            ✓ Gute Bruttomietrendite ({bruttomietrendite.toFixed(2)}%)
                        </p>
                    </div>
                ) : (
                    <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                        <p className="text-yellow-800 font-medium">
                            ⚠ Niedrige Bruttomietrendite ({bruttomietrendite.toFixed(2)}%)
                        </p>
                    </div>
                )}

                {monatlicheCashflow >= 0 ? (
                    <div className="p-3 bg-green-100 border border-green-300 rounded-lg">
                        <p className="text-green-800 font-medium">
                            ✓ Positiver Cashflow
                        </p>
                    </div>
                ) : (
                    <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                        <p className="text-red-800 font-medium">
                            ✗ Negativer Cashflow
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InvestmentRating
