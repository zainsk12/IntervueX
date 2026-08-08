import { Link } from 'react-router-dom'
import { FOCUS_AREAS } from '../../data/interviewSetup'
import { ROUTES } from '../../data/routes'
import type { CompetencyAssessment } from '../../types/results'

interface CompetencyAssessmentListProps {
  competencies: CompetencyAssessment[]
}

function focusLabel(focusArea: CompetencyAssessment['focusArea']): string {
  return FOCUS_AREAS.find((area) => area.value === focusArea)?.label ?? focusArea
}

export function CompetencyAssessmentList({ competencies }: CompetencyAssessmentListProps) {
  if (competencies.length === 0) {
    return null
  }

  return (
    <section className="rounded-lg border border-border-default bg-bg-elevated p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
        Competency Assessment
      </p>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">
        Competencies with at least one captured evidence record, grouped from this session's
        responses.
      </p>

      <ul className="mt-4 divide-y divide-border-subtle overflow-hidden rounded-md border border-border-subtle">
        {competencies.map((entry) => (
          <li className="px-4 py-3.5 sm:px-5" key={entry.competency}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-sm border border-border-default bg-surface-default px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-text-tertiary">
                  {focusLabel(entry.focusArea)}
                </span>
                <span className="text-sm font-medium text-text-primary">{entry.competency}</span>
              </div>
              <span className="font-mono text-[10px] text-accent-secondary">
                {entry.records.length} evidence record{entry.records.length === 1 ? '' : 's'}
              </span>
            </div>

            <ul className="mt-2 flex flex-wrap gap-1.5">
              {entry.records.map((record) => (
                <li key={record.questionId}>
                  <Link
                    className="inline-flex items-center rounded-sm border border-border-default px-2 py-1 font-mono text-[9px] text-text-secondary transition-colors hover:border-accent-secondary hover:text-text-primary"
                    to={`${ROUTES.EVIDENCE}/${record.questionId}`}
                  >
                    {record.meta}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}