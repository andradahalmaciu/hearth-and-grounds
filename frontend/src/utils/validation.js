/** @type {RegExp} Pattern for basic email format validation. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validates an email address against a basic format regex.
 * @param {string} email - The email address to validate.
 * @returns {{ isValid: boolean, errorMessage: string | null }} An object with `isValid`
 *          indicating success and `errorMessage` containing the validation error or `null` if valid.
 */
export function validateEmail(email) {
  if (!email) return { isValid: false, errorMessage: 'Email is required' }
  if (!EMAIL_RE.test(email)) return { isValid: false, errorMessage: 'Valid email required' }
  return { isValid: true, errorMessage: null }
}
