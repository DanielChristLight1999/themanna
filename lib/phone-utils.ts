// utils/phone.ts

/**
 * Removes all non-digit characters from a phone number string
 */
export function cleanPhoneNumber(value: string): string {
  return value.replace(/\D/g, "")
}

/**
 * Checks if a number is a valid Nigerian mobile number
 */
export function isValidNigerianNumber(phone: string): boolean {
  const cleaned = cleanPhoneNumber(phone)

  // Format: 080xxxxxxxx, 081xxxxxxxx, 070xxxxxxxx, 090xxxxxxxx, 091xxxxxxxx
  const localPattern = /^0[789][01]\d{8}$/
  const intlPattern = /^234[789][01]\d{8}$/

  return localPattern.test(cleaned) || intlPattern.test(cleaned)
}

/**
 * Formats a phone number input into +234 format for Nigerian numbers.
 * Designed for use in forms — assumes raw user input.
 */
export function formatPhoneNumber(input: string): string {
  const cleaned = cleanPhoneNumber(input)

  // If already international format and valid
  if (cleaned.startsWith("234") && isValidNigerianNumber(cleaned)) {
    return "+234" + cleaned.slice(3)
  }

  // If local format and valid (e.g., 08012345678)
  if (cleaned.startsWith("0") && isValidNigerianNumber(cleaned)) {
    return "+234" + cleaned.slice(1)
  }

  // If missing leading 0 but still valid (e.g., 8012345678)
  if (/^[789][01]\d{8}$/.test(cleaned)) {
    return "+234" + cleaned
  }

  // If already +234 and cleaned is valid
  if (input.startsWith("+234") && isValidNigerianNumber(cleaned)) {
    return "+234" + cleaned.slice(3)
  }

  // Fallback — return as-is to allow form validation to catch it
  return input
}


/**
 * Converts a Nigerian phone number from +234 format to local 0 format.
 * Example: "+2348123456789" → "08123456789"
 */
export function toLocalPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "") // Remove non-digits

  if (cleaned.startsWith("234") && cleaned.length === 13) {
    return "0" + cleaned.slice(3)
  }

  // If it’s already in local format
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return cleaned
  }

  return phone // fallback if it doesn't match expected pattern
}
