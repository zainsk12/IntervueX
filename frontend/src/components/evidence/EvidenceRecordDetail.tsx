import { FOCUS_AREAS } from '../../data/interviewSetup'
import type { EvidenceLogEntry } from '../../types/interview'

interface EvidenceRecordDetailProps {
  record: EvidenceLogEntry
}

function formatCapturedAt(capturedAt: string | null): string {
  if (!capturedAt) {
    return 'not yet captured'
  }

  try {
    return new Date(capturedAt).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return capturedAt
  }
}

export function EvidenceRecordDetail({ record }: EvidenceRecordDetailProps) {
  const focusLabel =
    FOCUS_AREAS.find((area) => area.value === record.focusArea)?.label ?? record.focusArea

  return (
    <article className="overflow-hidden rounded-lg border border-border-default bg-bg-inset">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-accent-secondary">{record.meta}</span>
          <span className="rounded-sm border border-border-default bg-surface-default px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-text-secondary">
            {focusLabel}
          </span>
        </div>
        <span
          className={`rounded-sm border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
            record.status === 'captured'
              ? 'border-accent-primary/40 text-accent-primary'
              : 'border-border-default text-text-tertiary'
          }`}
        >
          {record.status === 'captured' ? 'Captured' : 'Pending'}
        </span>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Competency
          </p>
          <p className="mt-1 text-base font-medium text-text-primary">{record.competency}</p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Question
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text-primary">{record.prompt}</p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Evidence Sought
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {record.evidenceSought}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Candidate Response
          </p>
          <p className="mt-2 whitespace-pre-wrap rounded-md border border-border-subtle bg-surface-muted px-3 py-3 text-sm leading-relaxed text-text-secondary">
            {record.response || 'No response recorded.'}
          </p>
        </div>
      </div>

      <div className="border-t border-border-subtle px-5 py-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
          Captured {formatCapturedAt(record.capturedAt)}
        </p>
      </div>
    </article>
  )
}