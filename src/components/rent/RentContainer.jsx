import { useCalculation } from '../../hooks/useCalculation'
import { RentForm, RentSummary } from './RentPresentational'

const RentContainer = () => {
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
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                    <RentForm
                        state={state}
                        onNettokaltmieteChange={(val) => updateField('nettokaltmiete', val)}
                        onStellplatzmieteChange={(val) => updateField('stellplatzmiete', val)}
                        onUmlagefaehigeKostenChange={(val) => updateField('umlagefaehigeKosten', val)}
                        onNichtUmlagefaehigeKostenChange={(val) => updateField('nichtUmlagefaehigeKosten', val)}
                    />
                </div>

                <RentSummary state={state} />
            </div>
        </div>
    )
}

export default RentContainer
