import React from 'react'
import { useCalculation } from '../hooks/useCalculation'
import RentalDataForm from './investment/RentalDataForm'
import ResultsDisplay from './investment/ResultsDisplay'
import InvestmentRating from './investment/InvestmentRating'

const RentPage = () => {
    const { state, updateField } = useCalculation()

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Miete & Betriebskosten
                </h1>
                <p className="text-gray-600">
                    Mieteinnahmen und nicht-umlagefähige Kosten verwalten
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Forms */}
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <RentalDataForm
                        nettokaltmiete={state.nettokaltmiete}
                        stellplatzmiete={state.stellplatzmiete}
                        umlagefaehigeKosten={state.umlagefaehigeKosten}
                        nichtUmlagefaehigeKosten={state.nichtUmlagefaehigeKosten}
                        hausgeld={state.hausgeld}
                        hausgeldQuote={state.hausgeldQuote}
                        monatlicheMiete={state.monatlicheMiete}
                        mieteProQm={state.mieteProQm}
                        hausgeldProQm={state.hausgeldProQm}
                        umlagefaehigProQm={state.umlagefaehigProQm}
                        nichtUmlagefaehigProQm={state.nichtUmlagefaehigProQm}
                        onNettokaltmieteChange={(val) => updateField('nettokaltmiete', val)}
                        onStellplatzmieteChange={(val) => updateField('stellplatzmiete', val)}
                        onUmlagefaehigeKostenChange={(val) => updateField('umlagefaehigeKosten', val)}
                        onNichtUmlagefaehigeKostenChange={(val) => updateField('nichtUmlagefaehigeKosten', val)}
                    />
                </div>

                {/* Results */}
                <div className="space-y-6">
                    <ResultsDisplay
                        state={state}
                        showRentDetails={true}
                    />

                    <InvestmentRating
                        bruttomietrendite={state.bruttomietrendite}
                        monatlicheCashflow={state.monatlicheCashflow}
                        hausgeldQuote={state.hausgeldQuote}
                        showCostDistribution={true}
                        hideGeneralRatings={true}
                    />
                </div>
            </div>
        </div>
    )
}

export default RentPage
