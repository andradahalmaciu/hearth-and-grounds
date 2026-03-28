import { z } from 'zod'

/** Zod schema for validating email strings. */
export const emailSchema = z.string().email('Valid email required')

/**
 * Validates an email address using the Zod email schema.
 * @param email - The email address to validate.
 * @returns An object with `isValid` indicating success and `errorMessage` containing
 *          the validation error or `null` if valid.
 */
export function validateEmail(email: string): { isValid: boolean; errorMessage: string | null } {
  const result = emailSchema.safeParse(email)
  if (result.success) return { isValid: true, errorMessage: null }
  return { isValid: false, errorMessage: result.error.issues[0]?.message ?? 'Valid email required' }
}
