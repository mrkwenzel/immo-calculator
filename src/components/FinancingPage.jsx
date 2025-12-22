import React from 'react'
import { useCalculation } from '../hooks/useCalculation'
import FinancingForm from './investment/FinancingForm'
import ResultsDisplay from './investment/ResultsDisplay'
import InvestmentRating from './investment/InvestmentRating'

const FinancingPage = () => {
    const { state, updateFinanzierung } = useCalculation()

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Finanzierung
                </h1>
                <p className="text-gray-600">
                    Darlehenskonditionen und Kapitaldienst berechnen (bis zu 3 Darlehen möglich)
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Forms */}
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <FinancingForm
                        finanzierung={state.finanzierung || []}
                        berechneteFinanzierung={state.berechneteFinanzierung || []}
                        onUpdate={updateFinanzierung}
                    />
                </div>

                {/* Results */}
                <div className="space-y-6">
                    <ResultsDisplay state={state} />

                    <InvestmentRating
                        bruttomietrendite={state.bruttomietrendite}
                        monatlicheCashflow={state.monatlicheCashflow}
                    />
                </div>
            </div>
        </div>
    )
}

export default FinancingPage
