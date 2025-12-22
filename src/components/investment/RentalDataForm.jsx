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
    monatlicheMiete,
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

                        {/* Display Calculated Total Rent */}
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-800">Gesamtmiete pro Monat:</span>
                                <span className="font-bold text-blue-900">
                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(monatlicheMiete || 0)}
                                </span>
                            </div>
                        </div>
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
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-blue-800">Berechnetes Hausgeld:</span>
                                <span className="font-bold text-blue-900">
                                    {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(hausgeld || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RentalDataForm
