import React from 'react'

/**
 * Reusable input field component with built-in validation
 * @param {Object} props - Component props
 * @param {string} props.label - Label text for the input
 * @param {string|number} props.value - Current value
 * @param {Function} props.onChange - Change handler (receives the raw value)
 * @param {Function} props.validator - Optional validation function
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.type - Input type (default: 'number')
 * @param {string} props.step - Step for number inputs
 * @param {string} props.error - External error message
 */
const InputField = ({
    label,
    value,
    onChange,
    validator = null,
    placeholder = '',
    type = 'number',
    step = '1',
    error: externalError = null
}) => {
    const [internalError, setInternalError] = React.useState(null)
    const [touched, setTouched] = React.useState(false)

    const handleChange = (e) => {
        const newValue = e.target.value

        // Validate if validator is provided
        if (validator && newValue !== '') {
            const validation = validator(newValue)
            if (!validation.isValid) {
                setInternalError(validation.error)
            } else {
                setInternalError(null)
            }
        } else {
            setInternalError(null)
        }

        // Always call onChange
        onChange(newValue)
    }

    const handleBlur = () => {
        setTouched(true)

        // Validate on blur if validator is provided
        if (validator && value !== '') {
            const validation = validator(value)
            if (!validation.isValid) {
                setInternalError(validation.error)
            } else {
                setInternalError(null)
            }
        }
    }

    const displayError = externalError || (touched ? internalError : null)
    const hasError = !!displayError

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                type={type}
                step={step}
                className={`input-field ${hasError ? 'border-red-500 focus:ring-red-500' : ''}`}
                value={value}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
            />
            {hasError && (
                <p className="mt-1 text-sm text-red-600">
                    {displayError}
                </p>
            )}
        </div>
    )
}

export default InputField
