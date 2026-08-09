interface EvidenceCoverageListProps {
  title: string
  description: string
  items: string[]
  emptyMessage: string
  tone: 'positive' | 'attention' | 'neutral'
}

const TONE_STYLE: Record<EvidenceCoverageListProps['tone'], string> = {
  positive: 'border-accent-primary/40 text-accent-primary',
  attention: 'border-warning/40 text-warning',
  neutral: 'border-accent-secondary/40 text-accent-secondary',
}

export function EvidenceCoverageList({
  title,
  description,
  items,
  emptyMessage,
  tone,
}: EvidenceCoverageListProps) {
  return (
    <section className="rounded-lg border border-border-default bg-bg-elevated p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>

      {items.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {items.map((item, index) => (
            <li
              className={`rounded-md border bg-bg-inset px-3 py-2.5 text-sm leading-relaxed ${TONE_STYLE[tone]}`}
              key={`${title}-${index}`}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 font-mono text-[11px] text-text-tertiary">{emptyMessage}</p>
      )}
    </section>
  )
}
