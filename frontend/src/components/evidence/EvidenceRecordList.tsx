import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FOCUS_AREAS } from '../../data/interviewSetup'
import { ROUTES } from '../../data/routes'
import type { EvidenceLogEntry } from '../../types/interview'

interface EvidenceRecordListProps {
  records: EvidenceLogEntry[]
}

function focusMeta(focusArea: EvidenceLogEntry['focusArea']): string {
  return FOCUS_AREAS.find((area) => area.value === focusArea)?.meta ?? focusArea.toUpperCase()
}

export function EvidenceRecordList({ records }: EvidenceRecordListProps) {
  return (
    <ul className="divide-y divide-border-subtle overflow-hidden rounded-lg border border-border-default bg-bg-inset">
      {records.map((record, index) => (
        <li key={record.questionId}>
          <Link
            className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-secondary sm:gap-4 sm:px-5"
            to={`${ROUTES.EVIDENCE}/${record.questionId}`}
          >
            <span className="w-10 shrink-0 font-mono text-[10px] text-text-tertiary">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-sm border border-border-default bg-surface-default px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-text-tertiary">
                  {focusMeta(record.focusArea)}
                </span>
                <span className="text-sm font-medium text-text-primary">{record.competency}</span>
              </div>
              <p className="mt-1 truncate text-xs text-text-secondary">{record.prompt}</p>
            </div>

            <span className="hidden shrink-0 font-mono text-[10px] text-accent-secondary sm:inline">
              {record.meta}
            </span>

            <span
              className={`shrink-0 rounded-sm border px-2 py-1 font-mono text-[9px] uppercase tracking-wider ${
                record.status === 'captured'
                  ? 'border-accent-primary/40 text-accent-primary'
                  : 'border-border-default text-text-tertiary'
              }`}
            >
              {record.status === 'captured' ? 'Captured' : 'Pending'}
            </span>

            <ChevronRight
              aria-hidden="true"
              className="hidden h-4 w-4 shrink-0 text-text-tertiary sm:block"
            />
          </Link>
        </li>
      ))}
    </ul>
  )
}