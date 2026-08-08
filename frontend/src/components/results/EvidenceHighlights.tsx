import { Link } from 'react-router-dom'
import { ROUTES } from '../../data/routes'
import type { EvidenceLogEntry } from '../../types/interview'

interface EvidenceHighlightsProps {
  records: EvidenceLogEntry[]
}

export function EvidenceHighlights({ records }: EvidenceHighlightsProps) {
  if (records.length === 0) {
    return null
  }

  return (
    <section className="rounded-lg border border-border-default bg-bg-elevated p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
        Evidence Highlights
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        A sample of the responses that were captured as evidence during this session.
      </p>

      <div className="mt-4 space-y-3">
        {records.map((record) => (
          <Link
            className="block rounded-md border border-border-subtle bg-bg-inset px-4 py-3.5 transition-colors hover:border-border-strong"
            key={record.questionId}
            to={`${ROUTES.EVIDENCE}/${record.questionId}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] text-accent-secondary">{record.meta}</span>
              <span className="text-xs font-medium text-text-primary">{record.competency}</span>
            </div>
            <p className="mt-1.5 truncate text-xs text-text-tertiary">{record.prompt}</p>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-secondary">
              {record.response || 'No response recorded.'}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}