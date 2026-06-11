import RentalDataForm from '../investment/RentalDataForm'
import ResultsDisplay from '../investment/ResultsDisplay'
import InvestmentRating from '../investment/InvestmentRating'

const RentForm = ({
    state,
    onNettokaltmieteChange,
    onStellplatzmieteChange,
    onUmlagefaehigeKostenChange,
    onNichtUmlagefaehigeKostenChange,
}) => (
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
        onNettokaltmieteChange={onNettokaltmieteChange}
        onStellplatzmieteChange={onStellplatzmieteChange}
        onUmlagefaehigeKostenChange={onUmlagefaehigeKostenChange}
        onNichtUmlagefaehigeKostenChange={onNichtUmlagefaehigeKostenChange}
    />
)

const RentSummary = ({ state }) => (
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
)

export { RentForm, RentSummary }
