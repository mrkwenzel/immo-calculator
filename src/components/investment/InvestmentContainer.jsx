import { useCalculation } from '../../hooks/useCalculation'
import { BasicInvestmentForm, InvestmentSummary } from './InvestmentPresentational'

const InvestmentContainer = () => {
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
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    <BasicInvestmentForm
                        state={state}
                        updateField={updateField}
                        updateNebenkosten={updateNebenkosten}
                        updateNebenkostenProzent={updateNebenkostenProzent}
                        updateNebenkostenModus={updateNebenkostenModus}
                    />
                </div>
                <InvestmentSummary state={state} />
            </div>
        </div>
    )
}

export default InvestmentContainer
