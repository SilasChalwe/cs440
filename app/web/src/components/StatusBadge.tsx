interface StatusBadgeProps {
  value: string
}

export function StatusBadge({ value }: StatusBadgeProps) {
  const normalized = value.toLowerCase()
  const tone = normalized.includes('pending')
    ? 'badge badge-warning'
    : normalized.includes('denied')
      ? 'badge badge-danger'
      : 'badge badge-success'

  return <span className={tone}>{value}</span>
}
