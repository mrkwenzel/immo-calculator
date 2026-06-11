import FinancingForm from '../investment/FinancingForm'
import ResultsDisplay from '../investment/ResultsDisplay'
import InvestmentRating from '../investment/InvestmentRating'

const LoanEntry = ({ finanzierung, berechneteFinanzierung, onUpdate }) => (
    <FinancingForm
        finanzierung={finanzierung}
        berechneteFinanzierung={berechneteFinanzierung}
        onUpdate={onUpdate}
    />
)

const FinancingOverview = ({ state }) => (
    <div className="space-y-6">
        <ResultsDisplay
            state={state}
            showFinancing={true}
            showCashflow={true}
        />
        <InvestmentRating
            bruttomietrendite={state.bruttomietrendite}
            monatlicheCashflow={state.monatlicheCashflow}
            eigenkapitalRendite={state.eigenkapitalRendite}
            hideGeneralRatings={true}
        />
    </div>
)

export { LoanEntry, FinancingOverview }
