interface SecurityNoticeProps {
  title: string
  points: string[]
}

export function SecurityNotice({ title, points }: SecurityNoticeProps) {
  return (
    <section className="security-note" aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </section>
  )
}
