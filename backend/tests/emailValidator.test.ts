import { describe, it, expect } from 'vitest'
import { validateEmail } from '../src/utils/emailValidator'

describe('validateEmail', () => {
  it('accepts a valid email', () => {
    expect(validateEmail('user@example.com')).toEqual({
      isValid: true,
      errorMessage: null,
    })
  })

  it('rejects an email missing @', () => {
    const result = validateEmail('userexample.com')
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toBe('Email must contain an @ symbol')
  })

  it('rejects an email missing a domain', () => {
    const result = validateEmail('user@')
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toBe('Email must have a domain after @')
  })

  it('rejects an empty string', () => {
    const result = validateEmail('')
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toBe('Email must not be empty')
  })

  it('rejects a domain without a TLD', () => {
    const result = validateEmail('user@localhost')
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toBe('Domain must include a top-level domain (e.g. .com)')
  })

  it('rejects a TLD shorter than 2 characters', () => {
    const result = validateEmail('user@example.a')
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toBe('Top-level domain must be at least 2 characters')
  })
})
