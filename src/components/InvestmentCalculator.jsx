import React from 'react'
import { useCalculation } from '../hooks/useCalculation'
import NebenkostenPresets from './NebenkostenPresets'
import BasicDataForm from './investment/BasicDataForm'
import AncillaryCostsForm from './investment/AncillaryCostsForm'
import RentalDataForm from './investment/RentalDataForm'
import ResultsDisplay from './investment/ResultsDisplay'
import InvestmentRating from './investment/InvestmentRating'

const InvestmentCalculator = () => {
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
          Investitionsrechner
        </h1>
        <p className="text-gray-600">
          Geben Sie die Details Ihrer Immobilien-Investition ein
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eingabeformular */}
        <div className="space-y-6">
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

          <RentalDataForm
            nettokaltmiete={state.nettokaltmiete}
            bewirtschaftungskosten={state.bewirtschaftungskosten}
            onNettokaltmieteChange={(val) => updateField('nettokaltmiete', val)}
            onBewirtschaftungskostenChange={(val) => updateField('bewirtschaftungskosten', val)}
          />
        </div>

        {/* Ergebnisse */}
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

export default InvestmentCalculator