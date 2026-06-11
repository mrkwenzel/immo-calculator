import BasicDataForm from './BasicDataForm'
import AncillaryCostsForm from './AncillaryCostsForm'
import NebenkostenPresets from '../NebenkostenPresets'
import ResultsDisplay from './ResultsDisplay'
import InvestmentRating from './InvestmentRating'

const InvestmentSummary = ({ state }) => (
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
)

const BasicInvestmentForm = ({ state, updateField, updateNebenkosten, updateNebenkostenProzent, updateNebenkostenModus }) => (
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
    </div>
)

export { InvestmentSummary, BasicInvestmentForm }
