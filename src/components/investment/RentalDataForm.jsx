import React from 'react'
import InputField from '../InputField'
import { validateRent, validateCosts } from '../../utils/validation'

const RentalDataForm = ({
    nettokaltmiete,
    bewirtschaftungskosten,
    onNettokaltmieteChange,
    onBewirtschaftungskostenChange
}) => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Mietdaten
            </h3>
            <div className="space-y-4">
                <InputField
                    label="Nettokaltmiete pro Monat (€)"
                    value={nettokaltmiete}
                    onChange={onNettokaltmieteChange}
                    validator={validateRent}
                    placeholder="z.B. 800"
                />

                <InputField
                    label="Bewirtschaftungskosten pro Monat (€)"
                    value={bewirtschaftungskosten}
                    onChange={onBewirtschaftungskostenChange}
                    validator={validateCosts}
                    placeholder="z.B. 150"
                />
            </div>
        </div>
    )
}

export default RentalDataForm
