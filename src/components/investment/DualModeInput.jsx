import React from 'react'

/**
 * Input component that supports switching between absolute (€) and percentage (%) modes
 */
const DualModeInput = ({
    label,
    value,
    percentValue,
    mode,
    onModeChange,
    onValueChange,
    onPercentChange,
    placeholder,
    calculatedValue = null,
    step = "0.1"
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
                <select
                    className="input-field sm:w-32"
                    value={mode}
                    onChange={(e) => onModeChange(e.target.value)}
                >
                    <option value="absolut">€</option>
                    <option value="prozent">%</option>
                </select>

                {mode === 'absolut' ? (
                    <input
                        type="number"
                        className="input-field flex-1"
                        value={value || ''}
                        onChange={(e) => onValueChange(e.target.value)}
                        placeholder={placeholder}
                    />
                ) : (
                    <input
                        type="number"
                        step={step}
                        className="input-field flex-1"
                        value={percentValue || ''}
                        onChange={(e) => onPercentChange(e.target.value)}
                        placeholder={`z.B. ${step === '0.1' ? '3.57' : '1.5'}`}
                    />
                )}
            </div>

            {mode === 'prozent' && calculatedValue !== null && (
                <div className="text-sm text-gray-600 mt-1">
                    Berechnet: {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(calculatedValue)}
                </div>
            )}
        </div>
    )
}

export default DualModeInput
