/**
 * Validation utilities for the Immobilien Kalkulator
 * Provides validation functions for user inputs with German error messages
 */

/**
 * Validates that a value is a valid positive number
 * @param {any} value - The value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validatePositiveNumber(value, fieldName = 'Wert') {
  const num = parseFloat(value)
  
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} ist erforderlich` }
  }
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} muss eine gültige Zahl sein` }
  }
  
  if (num <= 0) {
    return { isValid: false, error: `${fieldName} muss größer als 0 sein` }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates that a value is a valid non-negative number
 * @param {any} value - The value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateNonNegativeNumber(value, fieldName = 'Wert') {
  const num = parseFloat(value)
  
  if (value === '' || value === null || value === undefined) {
    return { isValid: true, error: null } // Optional field
  }
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} muss eine gültige Zahl sein` }
  }
  
  if (num < 0) {
    return { isValid: false, error: `${fieldName} kann nicht negativ sein` }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates that a value is a valid percentage (0-100)
 * @param {any} value - The value to validate
 * @param {string} fieldName - Name of the field for error messages
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validatePercentage(value, fieldName = 'Prozentsatz') {
  const num = parseFloat(value)
  
  if (value === '' || value === null || value === undefined) {
    return { isValid: true, error: null } // Optional field
  }
  
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} muss eine gültige Zahl sein` }
  }
  
  if (num < 0 || num > 100) {
    return { isValid: false, error: `${fieldName} muss zwischen 0 und 100 liegen` }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates purchase price
 * @param {any} value - The purchase price to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validatePurchasePrice(value) {
  const result = validatePositiveNumber(value, 'Kaufpreis')
  
  if (!result.isValid) {
    return result
  }
  
  const num = parseFloat(value)
  
  // Warn if unreasonably low or high
  if (num < 10000) {
    return { isValid: false, error: 'Kaufpreis scheint unrealistisch niedrig zu sein' }
  }
  
  if (num > 100000000) {
    return { isValid: false, error: 'Kaufpreis scheint unrealistisch hoch zu sein' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates living area
 * @param {any} value - The area to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateArea(value) {
  const result = validatePositiveNumber(value, 'Wohnfläche')
  
  if (!result.isValid) {
    return result
  }
  
  const num = parseFloat(value)
  
  // Warn if unreasonably small or large
  if (num < 10) {
    return { isValid: false, error: 'Wohnfläche scheint unrealistisch klein zu sein' }
  }
  
  if (num > 10000) {
    return { isValid: false, error: 'Wohnfläche scheint unrealistisch groß zu sein' }
  }
  
  return { isValid: true, error: null }
}

/**
 * Validates monthly rent
 * @param {any} value - The rent to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateRent(value) {
  return validateNonNegativeNumber(value, 'Miete')
}

/**
 * Validates operating costs
 * @param {any} value - The costs to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateCosts(value) {
  return validateNonNegativeNumber(value, 'Kosten')
}

/**
 * Validates ancillary costs (absolute value)
 * @param {any} value - The costs to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateAncillaryCosts(value) {
  return validateNonNegativeNumber(value, 'Nebenkosten')
}

/**
 * Validates ancillary costs percentage
 * @param {any} value - The percentage to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateAncillaryCostsPercentage(value) {
  const result = validatePercentage(value, 'Nebenkosten-Prozentsatz')
  
  if (!result.isValid) {
    return result
  }
  
  const num = parseFloat(value)
  
  // Warn if percentage seems unreasonably high
  if (num > 20) {
    return { 
      isValid: false, 
      error: 'Nebenkosten über 20% sind ungewöhnlich hoch' 
    }
  }
  
  return { isValid: true, error: null }
}
