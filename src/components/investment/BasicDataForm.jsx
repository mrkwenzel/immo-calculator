import { Calculator } from 'lucide-react'
import InputField from '../shared/forms/InputField'
import { validatePurchasePrice, validateArea } from '../../utils/validation'

const BasicDataForm = ({
    kaufpreis,
    wohnflaeche,
    kaufvertragsdatum,
    besitzuebergangsdatum,
    onKaufpreisChange,
    onWohnflaecheChange,
    onKaufvertragsdatumChange,
    onBesitzuebergangsdatumChange
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

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kaufvertragsdatum
                    </label>
                    <input
                        type="date"
                        className="input-field"
                        value={kaufvertragsdatum}
                        onChange={(e) => onKaufvertragsdatumChange(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Besitzübergangsdatum
                    </label>
                    <input
                        type="date"
                        className="input-field"
                        value={besitzuebergangsdatum}
                        min={kaufvertragsdatum || undefined}
                        onChange={(e) => onBesitzuebergangsdatumChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    )
}

export default BasicDataForm
