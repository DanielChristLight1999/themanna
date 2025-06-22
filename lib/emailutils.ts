// Email verification utilities
export function generateEmailVerificationCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let result = ""
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function formatVerificationCode(code: string): string {
  // Format as XXX-XXX for better readability
  return code.replace(/(.{3})(.{3})/, "$1-$2")
}