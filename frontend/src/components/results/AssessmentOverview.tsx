import { INTERVIEW_TYPES } from '../../data/interviewSetup'
import type { AssessmentSummary } from '../../types/results'
import type { CandidateSetupPayload } from '../../types/interview'

interface AssessmentOverviewProps {
  setup: CandidateSetupPayload
  summary: AssessmentSummary
}

const STATUS_LABEL: Record<AssessmentSummary['status'], string> = {
  'no-evidence': 'No Evidence',
  incomplete: 'Incomplete',
  complete: 'Complete',
}

const STATUS_STYLE: Record<AssessmentSummary['status'], string> = {
  'no-evidence': 'border-border-default text-text-secondary',
  incomplete: 'border-warning/50 text-warning',
  complete: 'border-success/50 text-success',
}

export function AssessmentOverview({ setup, summary }: AssessmentOverviewProps) {
  const typeLabel = INTERVIEW_TYPES.find((type) => type.value === setup.context.interviewType)?.label
  const progress =
    summary.totalQuestions > 0
      ? Math.min((summary.capturedCount / summary.totalQuestions) * 100, 100)
      : 0

  return (
    <section className="rounded-lg border border-border-default bg-bg-elevated p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
            Assessment Overview
          </p>
          <h1 className="mt-2 text-xl font-semibold text-text-primary sm:text-2xl">
            {setup.candidate.name || 'Candidate'}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            {setup.candidate.targetRole || 'Target role unspecified'}
            {typeLabel ? ` · ${typeLabel}` : ''}
          </p>
        </div>
        <span
          className={`rounded-sm border bg-bg-inset px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${STATUS_STYLE[summary.status]}`}
        >
          {STATUS_LABEL[summary.status]}
        </span>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
          <span>
            {summary.capturedCount} of {summary.totalQuestions} questions captured as evidence
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-accent-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="mt-4 rounded-md border border-border-subtle bg-bg-inset px-3 py-2.5 text-xs leading-relaxed text-text-tertiary">
        This overview reflects evidence <span className="text-text-secondary">coverage</span> —
        which competencies produced captured responses — not a scored evaluation. Response-quality
        grading is not implemented in this build; treat the sections below as observed evidence for
        a reviewer to interpret, not a final verdict.
      </p>
    </section>
  )
}