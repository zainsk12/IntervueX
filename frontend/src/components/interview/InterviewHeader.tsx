import { INTERVIEW_TYPES } from '../../data/interviewSetup'
import type { CandidateSetupPayload, InterviewPhase } from '../../types/interview'
import { PhasePill } from './PhasePill'

interface InterviewHeaderProps {
  setup: CandidateSetupPayload
  phase: InterviewPhase
  questionIndex: number
  totalQuestions: number
  answeredCount: number
}

export function InterviewHeader({
  setup,
  phase,
  questionIndex,
  totalQuestions,
  answeredCount,
}: InterviewHeaderProps) {
  const typeLabel = INTERVIEW_TYPES.find(
    (type) => type.value === setup.context.interviewType,
  )?.label
  const progress = totalQuestions > 0 ? Math.min((answeredCount / totalQuestions) * 100, 100) : 0
  const currentPosition = Math.min(questionIndex + 1, totalQuestions)

  return (
    <header className="border-b border-border-subtle bg-bg-elevated">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
              Interview Workspace
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              <span className="text-text-primary">{setup.candidate.name || 'Candidate'}</span>
              {' · '}
              {setup.candidate.targetRole || 'Target role unspecified'}
              {typeLabel ? ` · ${typeLabel}` : ''}
            </p>
          </div>
          <PhasePill phase={phase} />
        </div>

        <div>
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
            <span>
              Question {currentPosition} of {totalQuestions}
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
      </div>
    </header>
  )
}