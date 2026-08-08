import { FOCUS_AREAS } from '../../data/interviewSetup'
import type { FocusArea } from '../../types/interview'

interface EvidenceCoverageListProps {
  title: string
  description: string
  focusAreas: FocusArea[]
  emptyMessage: string
  tone: 'positive' | 'attention'
}

const TONE_STYLE: Record<EvidenceCoverageListProps['tone'], string> = {
  positive: 'border-accent-primary/40 text-accent-primary',
  attention: 'border-warning/40 text-warning',
}

export function EvidenceCoverageList({
  title,
  description,
  focusAreas,
  emptyMessage,
  tone,
}: EvidenceCoverageListProps) {
  return (
    <section className="rounded-lg border border-border-default bg-bg-elevated p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>

      {focusAreas.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {focusAreas.map((focusArea) => {
            const label = FOCUS_AREAS.find((area) => area.value === focusArea)?.label ?? focusArea
            return (
              <li
                className={`rounded-sm border bg-bg-inset px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${TONE_STYLE[tone]}`}
                key={focusArea}
              >
                {label}
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="mt-4 font-mono text-[11px] text-text-tertiary">{emptyMessage}</p>
      )}
    </section>
  )
}