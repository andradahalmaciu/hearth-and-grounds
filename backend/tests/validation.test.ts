import { describe, it, expect } from 'vitest'
import { validateEmail } from '../src/utils/validation'

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
    expect(result.errorMessage).toBeTruthy()
  })

  it('rejects an email missing a domain', () => {
    const result = validateEmail('user@')
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toBeTruthy()
  })

  it('rejects an empty string', () => {
    const result = validateEmail('')
    expect(result.isValid).toBe(false)
    expect(result.errorMessage).toBeTruthy()
  })
})
