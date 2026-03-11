export function formatCurrency(amount: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'ZMW',
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateIso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(dateIso))
}

export function maskAccount(account: string): string {
  if (account.length < 4) {
    return '****'
  }

  const visible = account.slice(-4)
  return `**** **** **** ${visible}`
}

export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}
