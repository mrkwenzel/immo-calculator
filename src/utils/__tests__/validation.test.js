import { describe, it, expect } from 'vitest'
import {
    validatePositiveNumber,
    validatePercentage,
    validatePurchasePrice
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
    })
})
