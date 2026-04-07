/**
 * utils/phoneValidator.js
 * -----------------------
 * Pure helper functions for phone number and OTP validation.
 * No framework dependencies – easy to unit-test in isolation.
 */

/**
 * Strip spaces and hyphens that users sometimes paste in.
 * e.g. "+91 98765-43210" → "+919876543210"
 */
export function normalizePhone(phone) {
  return String(phone || '').replace(/[\s-]/g, '')
}

/**
 * Accept Indian mobile numbers only: +91 followed by exactly 10 digits.
 */
export function isValidPhoneIndia(phone) {
  return /^\+91\d{10}$/.test(phone)
}

/**
 * OTP must be exactly 6 numeric digits.
 */
export function isValidOtp6(otp) {
  return /^\d{6}$/.test(String(otp || '').trim())
}
