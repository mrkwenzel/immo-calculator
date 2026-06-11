import { useCalculation } from '../../hooks/useCalculation'
import { LoanEntry, FinancingOverview } from './FinancingPresentational'

const FinancingContainer = () => {
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
                <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    <LoanEntry
                        finanzierung={state.finanzierung || []}
                        berechneteFinanzierung={state.berechneteFinanzierung || []}
                        onUpdate={updateFinanzierung}
                    />
                </div>
                <FinancingOverview state={state} />
            </div>
        </div>
    )
}

export default FinancingContainer
