import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AssessmentOverview } from '../components/results/AssessmentOverview'
import { CompetencyAssessmentList } from '../components/results/CompetencyAssessmentList'
import { EvidenceCoverageList } from '../components/results/EvidenceCoverageList'
import { EvidenceHighlights } from '../components/results/EvidenceHighlights'
import { SessionSummary } from '../components/results/SessionSummary'
import { ROUTES } from '../data/routes'
import { readCandidateSetup, readEvidenceLog } from '../lib/interviewSession'
import { buildAssessmentSummary } from '../lib/resultsAssessment'

export default function ResultsPage() {
  const setup = readCandidateSetup()
  const evidenceLog = readEvidenceLog()

  if (!setup || evidenceLog.length === 0) {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
          Results
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-text-primary">No assessment available yet</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          Results are synthesized from evidence captured during an interview session. Start a
          session to begin building an evidence-backed assessment.
        </p>
        <Link
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-semibold text-bg-base transition-colors hover:bg-accent-primary-hover"
          to={ROUTES.INTERVIEW_SETUP}
        >
          Go to Candidate Setup
        </Link>
      </section>
    )
  }

  const summary = buildAssessmentSummary(setup, evidenceLog)
  const capturedRecords = evidenceLog.filter((record) => record.status === 'captured')

  return (
    <section className="mx-auto w-full max-w-3xl space-y-5 px-4 py-10 sm:px-6 sm:py-14">
      <AssessmentOverview setup={setup} summary={summary} />

      {summary.status === 'incomplete' ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-warning/30 bg-bg-elevated px-4 py-3.5 sm:px-5">
          <p className="text-sm text-text-secondary">
            This session is still in progress —{' '}
            {summary.totalQuestions - summary.capturedCount} question
            {summary.totalQuestions - summary.capturedCount === 1 ? '' : 's'} remain uncaptured.
          </p>
          <Link
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border-default px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors hover:bg-surface-default"
            to={ROUTES.INTERVIEW}
          >
            Resume Interview
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}

      <CompetencyAssessmentList competencies={summary.competencies} />

      <EvidenceHighlights records={capturedRecords.slice(0, 3)} />

      <EvidenceCoverageList
        description="Focus areas for which the candidate provided a captured response during this session."
        emptyMessage="No captured evidence yet."
        focusAreas={summary.evidencedFocusAreas}
        title="Strengths — Evidence Captured"
        tone="positive"
      />

      <EvidenceCoverageList
        description="Focus areas selected at setup that have not yet produced captured evidence. This reflects coverage, not confirmed weakness."
        emptyMessage="All selected focus areas have captured evidence."
        focusAreas={summary.followUpFocusAreas}
        title="Gaps — Follow-up Areas"
        tone="attention"
      />

      <SessionSummary evidenceLog={evidenceLog} setup={setup} totalQuestions={summary.totalQuestions} />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap gap-2">
          <Link
            className="inline-flex items-center gap-2 rounded-md border border-border-default px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors hover:bg-surface-default"
            to={ROUTES.INTERVIEW_SETUP}
          >
            Candidate Setup
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-md border border-border-default px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors hover:bg-surface-default"
            to={ROUTES.INTERVIEW}
          >
            Interview Workspace
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-md border border-border-default px-3 py-1.5 text-xs font-semibold text-text-primary transition-colors hover:bg-surface-default"
            to={ROUTES.EVIDENCE}
          >
            Evidence Log
          </Link>
        </div>
      </div>
    </section>
  )
}