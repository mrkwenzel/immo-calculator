import React from 'react'

const InvestmentRating = ({
    bruttomietrendite,
    monatlicheCashflow,
    eigenkapitalRendite = null,
    hausgeldQuote = 0,
    showCostDistribution = false,
    hideGeneralRatings = false
}) => {
    const showEkRendite = eigenkapitalRendite !== null;

    if (hideGeneralRatings && !showCostDistribution && !showEkRendite) return null;

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Bewertung
            </h3>
            <div className="space-y-4">
                {/* EK-Rendite Rating (New) */}
                {showEkRendite && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-800 font-medium">EK-Rendite:</span>
                            <span className="text-gray-900 font-bold text-lg">
                                {eigenkapitalRendite.toFixed(2)}%
                            </span>
                        </div>
                        {eigenkapitalRendite >= 10 ? (
                            <p className="text-[10px] text-green-600 font-medium italic">
                                ✓ Exzellente Hebelwirkung des Kapitals
                            </p>
                        ) : eigenkapitalRendite >= 5 ? (
                            <p className="text-[10px] text-blue-600 font-medium italic">
                                ✓ Solide Eigenkapital-Rentabilität
                            </p>
                        ) : (
                            <p className="text-[10px] text-orange-600 font-medium italic">
                                ! Geringe Hebelwirkung bei aktuellem Zins
                            </p>
                        )}
                    </div>
                )}

                {showCostDistribution && (
                    <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-2 mb-3">
                            Hausgeld-Verteilung
                        </h4>
                        <div className="relative h-4 bg-red-100 rounded-full overflow-hidden flex">
                            <div
                                className="h-full bg-green-500 transition-all duration-500"
                                style={{ width: `${hausgeldQuote}%` }}
                                title={`Umlagefähig: ${hausgeldQuote.toFixed(1)}%`}
                            ></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider">
                            <span className="text-green-600">Umlagefähig ({hausgeldQuote.toFixed(1)}%)</span>
                            <span className="text-red-600">Nicht-Umlagefähig ({(100 - hausgeldQuote).toFixed(1)}%)</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 italic text-center">
                            Ein höherer umlagefähiger Anteil entlastet den Cashflow.
                        </p>
                    </div>
                )}

                {!hideGeneralRatings && (
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
                )}
            </div>
        </div>
    )
}

export default InvestmentRating
