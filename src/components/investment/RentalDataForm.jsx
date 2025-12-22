import React from 'react'
import InputField from '../InputField'
import { validateRent, validateCosts } from '../../utils/validation'

const RentalDataForm = ({
    nettokaltmiete,
    stellplatzmiete,
    umlagefaehigeKosten,
    nichtUmlagefaehigeKosten,
    hausgeld,
    hausgeldQuote,
    onNettokaltmieteChange,
    onStellplatzmieteChange,
    onUmlagefaehigeKostenChange,
    onNichtUmlagefaehigeKostenChange
}) => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mietdaten & Hausgeld
            </h3>
            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Einnahmen</h4>
                    <div className="space-y-4">
                        <InputField
                            label="Nettokaltmiete pro Monat (€)"
                            value={nettokaltmiete}
                            onChange={onNettokaltmieteChange}
                            validator={validateRent}
                            placeholder="z.B. 800"
                        />

                        <InputField
                            label="Stellplatzmiete pro Monat (€)"
                            value={stellplatzmiete}
                            onChange={onStellplatzmieteChange}
                            validator={validateCosts}
                            placeholder="z.B. 50"
                        />
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Hausgeld & Kosten</h4>
                    <div className="space-y-4">
                        <InputField
                            label="Umlagefähige Kosten (€)"
                            value={umlagefaehigeKosten}
                            onChange={onUmlagefaehigeKostenChange}
                            validator={validateCosts}
                            placeholder="z.B. 200"
                        />

                        <InputField
                            label="Nicht-umlagefähige Kosten (€)"
                            value={nichtUmlagefaehigeKosten}
                            onChange={onNichtUmlagefaehigeKostenChange}
                            validator={validateCosts}
                            placeholder="z.B. 50"
                        />

                        {/* Display Calculated Hausgeld */}
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm text-gray-600">Berechnetes Hausgeld:</span>
                                <span className="font-semibold text-gray-900">
                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(hausgeld || 0)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>davon umlagefähig:</span>
                                <span>{(hausgeldQuote || 0).toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RentalDataForm
