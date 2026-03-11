const CSV_FORMULA_PREFIX = /^[=+\-@\t\r]/

function removeControlChars(value: string): string {
  let output = ''

  for (const char of value) {
    const code = char.charCodeAt(0)
    const isControl = (code >= 0 && code <= 8) || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127
    if (!isControl) {
      output += char
    }
  }

  return output
}

export function sanitizeText(input: unknown, maxLength = 256): string {
  const value = removeControlChars(String(input ?? '')).trim()
  return value.slice(0, maxLength)
}

export function sanitizeIdentifier(input: unknown, maxLength = 64): string {
  const value = sanitizeText(input, maxLength)
  return value.replace(/[^a-zA-Z0-9_-]/g, '')
}

export function sanitizeEmail(input: unknown): string {
  const value = sanitizeText(input, 254).toLowerCase()
  return value.replace(/[^a-z0-9@._+-]/g, '')
}

export function sanitizePhone(input: unknown): string {
  const value = sanitizeText(input, 32)
  return value.replace(/[^0-9+\-()\s]/g, '')
}

export function sanitizeMoney(input: unknown): number {
  const value = Number(input)
  if (!Number.isFinite(value) || value <= 0) {
    return 0
  }

  return Number(value.toFixed(2))
}

export function safeCsvCell(input: unknown): string {
  const cleaned = sanitizeText(input, 4000)
  const guarded = CSV_FORMULA_PREFIX.test(cleaned) ? `'${cleaned}` : cleaned
  const escaped = guarded.replaceAll('"', '""')
  return `"${escaped}"`
}
