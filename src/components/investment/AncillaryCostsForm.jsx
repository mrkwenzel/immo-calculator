import React from 'react'
import DualModeInput from './DualModeInput'

const AncillaryCostsForm = ({
    state,
    onNebenkostenChange,
    onNebenkostenProzentChange,
    onModusChange
}) => {
    const getBerechneterWert = (field) => {
        return state.berechneteNebenkosten ? state.berechneteNebenkosten[field] || 0 : 0
    }

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Kaufnebenkosten
            </h3>
            <div className="space-y-6">
                <DualModeInput
                    label="Makler"
                    value={state.kaufnebenkosten.makler}
                    percentValue={state.nebenkostenProzentual.makler}
                    mode={state.nebenkostenModus.makler}
                    onModeChange={(val) => onModusChange('makler', val)}
                    onValueChange={(val) => onNebenkostenChange('makler', val)}
                    onPercentChange={(val) => onNebenkostenProzentChange('makler', val)}
                    placeholder="z.B. 8000"
                    calculatedValue={getBerechneterWert('makler')}
                />

                <DualModeInput
                    label="Notar"
                    value={state.kaufnebenkosten.notar}
                    percentValue={state.nebenkostenProzentual.notar}
                    mode={state.nebenkostenModus.notar}
                    onModeChange={(val) => onModusChange('notar', val)}
                    onValueChange={(val) => onNebenkostenChange('notar', val)}
                    onPercentChange={(val) => onNebenkostenProzentChange('notar', val)}
                    placeholder="z.B. 2500"
                    calculatedValue={getBerechneterWert('notar')}
                />

                <DualModeInput
                    label="Grunderwerbssteuer"
                    value={state.kaufnebenkosten.grunderwerbssteuer}
                    percentValue={state.nebenkostenProzentual.grunderwerbssteuer}
                    mode={state.nebenkostenModus.grunderwerbssteuer}
                    onModeChange={(val) => onModusChange('grunderwerbssteuer', val)}
                    onValueChange={(val) => onNebenkostenChange('grunderwerbssteuer', val)}
                    onPercentChange={(val) => onNebenkostenProzentChange('grunderwerbssteuer', val)}
                    placeholder="z.B. 15000"
                    calculatedValue={getBerechneterWert('grunderwerbssteuer')}
                />

                <DualModeInput
                    label="Sonstige Kosten"
                    value={state.kaufnebenkosten.sonstige}
                    percentValue={state.nebenkostenProzentual.sonstige}
                    mode={state.nebenkostenModus.sonstige}
                    onModeChange={(val) => onModusChange('sonstige', val)}
                    onValueChange={(val) => onNebenkostenChange('sonstige', val)}
                    onPercentChange={(val) => onNebenkostenProzentChange('sonstige', val)}
                    placeholder="z.B. 1000"
                    calculatedValue={getBerechneterWert('sonstige')}
                />
            </div>
        </div>
    )
}

export default AncillaryCostsForm
