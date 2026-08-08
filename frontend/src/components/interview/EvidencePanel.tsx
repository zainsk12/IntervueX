import { FOCUS_AREAS } from '../../data/interviewSetup'
import type {
  CandidateSetupPayload,
  EvidenceLogEntry,
  InterviewPhase,
  InterviewQuestion,
} from '../../types/interview'

interface EvidencePanelProps {
  setup: CandidateSetupPayload
  question: InterviewQuestion
  phase: InterviewPhase
  evidenceLog: EvidenceLogEntry[]
}

function signalStateLabel(phase: InterviewPhase): string {
  switch (phase) {
    case 'ready':
      return 'awaiting response'
    case 'answering':
      return 'response in progress'
    case 'evaluating':
      return 'evaluating response…'
    case 'adapting':
      return 'updating competency model…'
    case 'next-question':
      return 'model updated'
    case 'complete':
      return 'session complete'
    default:
      return ''
  }
}

export function EvidencePanel({ setup, question, phase, evidenceLog }: EvidencePanelProps) {
  const capturedCount = evidenceLog.filter((entry) => entry.status === 'captured').length
  const focusLabels = setup.context.focusAreas
    .map((value) => FOCUS_AREAS.find((area) => area.value === value)?.label)
    .filter((label): label is string => Boolean(label))

  return (
    <aside
      aria-label="Evidence chamber"
      className="overflow-hidden rounded-lg border border-border-default bg-bg-inset"
    >
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
          Evidence Chamber
        </span>
        <span className="font-mono text-[10px] text-accent-secondary">
          {capturedCount} captured
        </span>
      </div>

      <div className="space-y-4 px-4 py-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Competency
          </p>
          <p className="mt-1 text-sm text-text-primary">{question.competency}</p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Evidence Sought
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {question.evidenceSought}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Current Hypothesis
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {setup.candidate.targetRole || 'Role unspecified'} ·{' '}
            {focusLabels.length > 0 ? focusLabels.join(', ') : 'general technical proficiency'}
          </p>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Signal State
          </p>
          <p className="mt-1 font-mono text-[11px] text-accent-secondary">
            {signalStateLabel(phase)}
          </p>
        </div>
      </div>

      {evidenceLog.length > 0 ? (
        <div className="border-t border-border-subtle px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Session Log
          </p>
          <ul className="mt-2 space-y-1.5">
            {evidenceLog.map((entry) => (
              <li
                className="flex items-center justify-between gap-2 font-mono text-[10px]"
                key={entry.questionId}
              >
                <span className="truncate text-text-secondary">{entry.competency}</span>
                <span
                  className={
                    entry.status === 'captured' ? 'text-accent-primary' : 'text-text-tertiary'
                  }
                >
                  {entry.status === 'captured' ? 'CAPTURED' : 'PENDING'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </aside>
  )
}