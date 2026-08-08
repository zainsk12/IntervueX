import { DEPTH_LEVELS, DIFFICULTY_LEVELS, INTERVIEW_TYPES } from '../../data/interviewSetup'
import { EvidenceRecordList } from '../evidence/EvidenceRecordList'
import type { CandidateSetupPayload, EvidenceLogEntry } from '../../types/interview'

interface SessionSummaryProps {
  setup: CandidateSetupPayload
  evidenceLog: EvidenceLogEntry[]
  totalQuestions: number
}

function formatSubmittedAt(submittedAt: string): string {
  try {
    return new Date(submittedAt).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return submittedAt
  }
}

export function SessionSummary({ setup, evidenceLog, totalQuestions }: SessionSummaryProps) {
  const typeLabel = INTERVIEW_TYPES.find((type) => type.value === setup.context.interviewType)?.label
  const difficultyLabel = DIFFICULTY_LEVELS.find(
    (level) => level.value === setup.configuration.difficulty,
  )?.label
  const depthLabel = DEPTH_LEVELS.find((level) => level.value === setup.configuration.depth)?.label

  return (
    <section className="rounded-lg border border-border-default bg-bg-elevated p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
        Session Summary
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Interview Type
          </dt>
          <dd className="mt-1 text-sm text-text-primary">{typeLabel ?? 'Unspecified'}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Difficulty
          </dt>
          <dd className="mt-1 text-sm text-text-primary">{difficultyLabel ?? 'Standard'}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Depth
          </dt>
          <dd className="mt-1 text-sm text-text-primary">{depthLabel ?? 'Standard'}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Questions Planned
          </dt>
          <dd className="mt-1 text-sm text-text-primary">{totalQuestions}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Experience Level
          </dt>
          <dd className="mt-1 text-sm capitalize text-text-primary">
            {setup.candidate.experienceLevel}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Session Started
          </dt>
          <dd className="mt-1 text-sm text-text-primary">
            {formatSubmittedAt(setup.submittedAt)}
          </dd>
        </div>
      </dl>

      {evidenceLog.length > 0 ? (
        <div className="mt-5">
          <p className="font-mono text-[10px] uppercase tracking-wide text-text-tertiary">
            Full Evidence Log
          </p>
          <div className="mt-2">
            <EvidenceRecordList records={evidenceLog} />
          </div>
        </div>
      ) : null}
    </section>
  )
}