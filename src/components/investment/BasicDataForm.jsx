import React from 'react'
import { Calculator } from 'lucide-react'
import InputField from '../InputField'
import { validatePurchasePrice, validateArea } from '../../utils/validation'

const BasicDataForm = ({
    kaufpreis,
    wohnflaeche,
    onKaufpreisChange,
    onWohnflaecheChange
}) => {
    return (
        <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="mr-2" size={20} />
                Grunddaten
            </h3>
            <div className="space-y-4">
                <InputField
                    label="Kaufpreis (€)"
                    value={kaufpreis}
                    onChange={onKaufpreisChange}
                    validator={validatePurchasePrice}
                    placeholder="z.B. 250000"
                />

                <InputField
                    label="Wohnfläche (m²)"
                    value={wohnflaeche}
                    onChange={onWohnflaecheChange}
                    validator={validateArea}
                    placeholder="z.B. 85"
                />
            </div>
        </div>
    )
}

export default BasicDataForm
