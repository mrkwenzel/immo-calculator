import React from 'react'
import InputField from '../InputField'
import DualModeInput from './DualModeInput'
import { Landmark } from 'lucide-react'

const FinancingForm = ({
    finanzierung = [], // Array of loans
    berechneteFinanzierung = [], // Array of results
    onUpdate
}) => {
    const formatCurrency = (val) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(val)

    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Landmark className="w-5 h-5 mr-2" />
                Finanzierung
            </h3>

            <div className="space-y-8">
                {finanzierung.map((loan, index) => {
                    const result = berechneteFinanzierung[index] || { betrag: 0, rate: 0 }
                    const isOptional = index > 0
                    const title = index === 0 ? "Darlehen 1 (Hauptfinanzierung)" : `Darlehen ${index + 1} (Optional)`

                    return (
                        <div key={index} className={`space-y-4 pt-4 ${index > 0 ? "border-t border-gray-200" : ""}`}>
                            <h4 className="font-medium text-gray-700">{title}</h4>

                            <DualModeInput
                                label="Darlehensbetrag"
                                mode={loan.modus}
                                value={loan.darlehensbetrag}
                                percentValue={loan.darlehensbetrag}
                                onModeChange={(val) => onUpdate(index, 'modus', val)}
                                onValueChange={(val) => onUpdate(index, 'darlehensbetrag', val)}
                                onPercentChange={(val) => onUpdate(index, 'darlehensbetrag', val)}
                                calculatedValue={loan.modus === 'prozent' ? result.betrag : null}
                                placeholder={loan.modus === 'prozent' ? 'z.B. 80' : 'Betrag in €'}
                                step={loan.modus === 'prozent' ? "1" : "1000"}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField
                                    label="Zinssatz (%)"
                                    value={loan.zinssatz}
                                    onChange={(val) => onUpdate(index, 'zinssatz', val)}
                                    placeholder="z.B. 3.5"
                                />

                                <InputField
                                    label="Anfängliche Tilgung (%)"
                                    value={loan.tilgung}
                                    onChange={(val) => onUpdate(index, 'tilgung', val)}
                                    placeholder="z.B. 2.0"
                                />
                            </div>

                            {/* Sub-Result for this loan */}
                            {(result.betrag > 0) && (
                                <div className="text-xs text-gray-500 flex justify-between bg-gray-50 p-2 rounded">
                                    <span>Rate: <strong>{formatCurrency(result.rate)}</strong> / Monat</span>
                                    <span>(Volumen: {formatCurrency(result.betrag)})</span>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FinancingForm
