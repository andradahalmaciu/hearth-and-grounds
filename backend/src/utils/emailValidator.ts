/**
 * Result of an email validation check.
 */
export interface EmailValidationResult {
  isValid: boolean
  errorMessage: string | null
}

/**
 * Validates an email address by checking for the presence of an `@` symbol
 * and a domain with a valid top-level domain (TLD).
 *
 * @param email - The email address string to validate.
 * @returns An {@link EmailValidationResult} with `isValid` indicating success
 *          and `errorMessage` containing the reason for failure, or `null` if valid.
 *
 * @example
 * ```ts
 * validateEmail('user@example.com') // { isValid: true, errorMessage: null }
 * validateEmail('invalid')          // { isValid: false, errorMessage: 'Email must contain an @ symbol' }
 * ```
 */
export function validateEmail(email: string): EmailValidationResult {
  if (!email) {
    return { isValid: false, errorMessage: 'Email must not be empty' }
  }

  if (!email.includes('@')) {
    return { isValid: false, errorMessage: 'Email must contain an @ symbol' }
  }

  const [local, domain] = email.split('@')

  if (!local) {
    return { isValid: false, errorMessage: 'Email must have a local part before @' }
  }

  if (!domain) {
    return { isValid: false, errorMessage: 'Email must have a domain after @' }
  }

  if (!domain.includes('.')) {
    return { isValid: false, errorMessage: 'Domain must include a top-level domain (e.g. .com)' }
  }

  const tld = domain.split('.').pop()!
  if (tld.length < 2) {
    return { isValid: false, errorMessage: 'Top-level domain must be at least 2 characters' }
  }

  return { isValid: true, errorMessage: null }
}
