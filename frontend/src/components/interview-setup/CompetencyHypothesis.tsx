import { FOCUS_AREAS, INTERVIEW_TYPES } from '../../data/interviewSetup'
import type { FocusArea, InterviewType } from '../../types/interview'

interface CompetencyHypothesisProps {
  candidateName: string
  targetRole: string
  interviewType: InterviewType | ''
  focusAreas: FocusArea[]
}

export function CompetencyHypothesis({
  candidateName,
  targetRole,
  interviewType,
  focusAreas,
}: CompetencyHypothesisProps) {
  const typeLabel = INTERVIEW_TYPES.find((type) => type.value === interviewType)?.label
  const selectedAreas = FOCUS_AREAS.filter((area) => focusAreas.includes(area.value))

  return (
    <div className="rounded-lg border border-accent-primary/25 bg-bg-inset p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-primary">
        Initial Competency Hypothesis
      </p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
        Resume and role context form an initial competency hypothesis — not a verdict.
        The interview adapts as evidence is collected.
      </p>

      <div className="mt-4 space-y-1.5 font-mono text-[11px] text-text-tertiary">
        <p>
          <span className="text-text-secondary">candidate</span> ·{' '}
          {candidateName.trim() || 'unspecified'}
        </p>
        <p>
          <span className="text-text-secondary">target_role</span> ·{' '}
          {targetRole.trim() || 'unspecified'}
        </p>
        <p>
          <span className="text-text-secondary">interview_type</span> ·{' '}
          {typeLabel ?? 'unspecified'}
        </p>
      </div>

      {selectedAreas.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {selectedAreas.map((area) => (
            <span
              className="rounded-sm border border-accent-primary/20 bg-surface-default px-2.5 py-1 font-mono text-[10px] text-accent-primary"
              key={area.value}
            >
              {area.meta} · {area.label}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-4 font-mono text-[10px] text-text-tertiary">
          no focus signals selected yet
        </p>
      )}
    </div>
  )
}