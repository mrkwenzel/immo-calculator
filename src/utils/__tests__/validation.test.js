import { describe, it, expect } from 'vitest'
import {
    validatePositiveNumber,
    validateNonNegativeNumber,
    validatePercentage,
    validatePurchasePrice,
    validateArea,
    validateRent,
    validateCosts,
    validateAncillaryCosts,
    validateAncillaryCostsPercentage
} from '../validation'

describe('validation utils', () => {
    describe('validatePositiveNumber', () => {
        it('returns valid for positive numbers', () => {
            expect(validatePositiveNumber(100).isValid).toBe(true)
            expect(validatePositiveNumber('100').isValid).toBe(true)
            expect(validatePositiveNumber(0.1).isValid).toBe(true)
        })

        it('returns invalid for zero', () => {
            const result = validatePositiveNumber(0)
            expect(result.isValid).toBe(false)
            expect(result.error).toContain('größer als 0')
        })

        it('returns invalid for negative numbers', () => {
            const result = validatePositiveNumber(-10)
            expect(result.isValid).toBe(false)
            expect(result.error).toContain('größer als 0')
        })

        it('returns invalid for non-numbers', () => {
            const result = validatePositiveNumber('abc')
            expect(result.isValid).toBe(false)
            expect(result.error).toContain('gültige Zahl')
        })

        it('returns invalid for empty/null values', () => {
            expect(validatePositiveNumber('').isValid).toBe(false)
            expect(validatePositiveNumber(null).isValid).toBe(false)
            expect(validatePositiveNumber(undefined).isValid).toBe(false)
        })
    })

    describe('validateNonNegativeNumber', () => {
        it('returns valid for positive numbers and zero', () => {
            expect(validateNonNegativeNumber(100).isValid).toBe(true)
            expect(validateNonNegativeNumber(0).isValid).toBe(true)
        })

        it('returns invalid for negative numbers', () => {
            const result = validateNonNegativeNumber(-10)
            expect(result.isValid).toBe(false)
            expect(result.error).toContain('kann nicht negativ sein')
        })

        it('returns valid for optional empty values', () => {
            expect(validateNonNegativeNumber('').isValid).toBe(true)
            expect(validateNonNegativeNumber(null).isValid).toBe(true)
        })

        it('returns invalid for non-numbers', () => {
            expect(validateNonNegativeNumber('abc').isValid).toBe(false)
        })
    })

    describe('validatePercentage', () => {
        it('returns valid for 0-100', () => {
            expect(validatePercentage(0).isValid).toBe(true)
            expect(validatePercentage(50).isValid).toBe(true)
            expect(validatePercentage(100).isValid).toBe(true)
        })

        it('returns invalid for < 0', () => {
            expect(validatePercentage(-1).isValid).toBe(false)
        })

        it('returns invalid for > 100', () => {
            expect(validatePercentage(101).isValid).toBe(false)
        })

        it('returns valid for optional empty values', () => {
            expect(validatePercentage('').isValid).toBe(true)
        })
    })

    describe('validatePurchasePrice', () => {
        it('validates normal price', () => {
            expect(validatePurchasePrice(250000).isValid).toBe(true)
        })

        it('warns on very low price', () => {
            const result = validatePurchasePrice(5000)
            expect(result.isValid).toBe(false)
            expect(result.error).toContain('unrealistisch')
        })

        it('warns on very high price', () => {
            const result = validatePurchasePrice(200000000)
            expect(result.isValid).toBe(false)
            expect(result.error).toContain('unrealistisch')
        })
    })

    describe('validateArea', () => {
        it('validates normal area', () => {
            expect(validateArea(60).isValid).toBe(true)
        })

        it('warns on very small area', () => {
            const result = validateArea(5)
            expect(result.isValid).toBe(false)
            expect(result.error).toContain('unrealistisch')
        })

        it('warns on very large area', () => {
            const result = validateArea(20000)
            expect(result.isValid).toBe(false)
            expect(result.error).toContain('unrealistisch')
        })
    })

    describe('validateRent', () => {
        it('uses non-negative validation', () => {
            expect(validateRent(500).isValid).toBe(true)
            expect(validateRent(-10).isValid).toBe(false)
        })
    })

    describe('validateCosts', () => {
        it('uses non-negative validation', () => {
            expect(validateCosts(100).isValid).toBe(true)
            expect(validateCosts(-10).isValid).toBe(false)
        })
    })

    describe('validateAncillaryCosts', () => {
        it('uses non-negative validation', () => {
            expect(validateAncillaryCosts(2000).isValid).toBe(true)
            expect(validateAncillaryCosts(-10).isValid).toBe(false)
        })
    })

    describe('validateAncillaryCostsPercentage', () => {
        it('validates normal percentage', () => {
            expect(validateAncillaryCostsPercentage(10).isValid).toBe(true)
        })

        it('warns on very high percentage', () => {
            const result = validateAncillaryCostsPercentage(25)
            expect(result.isValid).toBe(false)
            expect(result.error).toContain('ungewöhnlich hoch')
        })

        it('returns invalid for out-of-range percentage', () => {
            expect(validateAncillaryCostsPercentage(110).isValid).toBe(false)
        })
    })
})
