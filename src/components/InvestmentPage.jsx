import React from 'react'
import { useCalculation } from '../hooks/useCalculation'
import BasicDataForm from './investment/BasicDataForm'
import AncillaryCostsForm from './investment/AncillaryCostsForm'
import NebenkostenPresets from './NebenkostenPresets'
import ResultsDisplay from './investment/ResultsDisplay'
import InvestmentRating from './investment/InvestmentRating'

const InvestmentPage = () => {
    const {
        state,
        updateField,
        updateNebenkosten,
        updateNebenkostenProzent,
        updateNebenkostenModus
    } = useCalculation()

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Investitionsdaten
                </h1>
                <p className="text-gray-600">
                    Kaufpreis, Fläche und Kaufnebenkosten erfassen
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Forms */}
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <BasicDataForm
                        kaufpreis={state.kaufpreis}
                        wohnflaeche={state.wohnflaeche}
                        onKaufpreisChange={(val) => updateField('kaufpreis', val)}
                        onWohnflaecheChange={(val) => updateField('wohnflaeche', val)}
                    />

                    <AncillaryCostsForm
                        state={state}
                        onNebenkostenChange={updateNebenkosten}
                        onNebenkostenProzentChange={updateNebenkostenProzent}
                        onModusChange={updateNebenkostenModus}
                    />

                    <NebenkostenPresets />
                </div>

                {/* Results */}
                <div className="space-y-6">
                    <ResultsDisplay
                        state={state}
                        showInvestmentBasics={true}
                        showCashflow={true}
                    />

                    <InvestmentRating
                        bruttomietrendite={state.bruttomietrendite}
                        monatlicheCashflow={state.cashflowNachBank}
                    />
                </div>
            </div>
        </div>
    )
}

export default InvestmentPage
