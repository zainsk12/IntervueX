import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EvidenceRecordDetail } from '../components/evidence/EvidenceRecordDetail'
import { EvidenceRecordList } from '../components/evidence/EvidenceRecordList'
import { ROUTES } from '../data/routes'
import { readEvidenceLog } from '../lib/interviewSession'

export default function EvidencePage() {
  const { evidenceId } = useParams<{ evidenceId?: string }>()
  const records = readEvidenceLog()
  const capturedCount = records.filter((record) => record.status === 'captured').length

  if (records.length === 0) {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
          Evidence System
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-text-primary">No evidence captured yet</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          Evidence records are captured as a candidate responds during the Interview Workspace.
          Start or resume a session to begin building an evidence log.
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

  if (evidenceId) {
    const record = records.find((entry) => entry.questionId === evidenceId)

    if (!record) {
      return (
        <section className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
            Evidence System
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-text-primary">Record not found</h1>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            No evidence record exists for ID <span className="font-mono">{evidenceId}</span> in the
            current session.
          </p>
          <Link
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-border-default px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-default"
            to={ROUTES.EVIDENCE}
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to Evidence Log
          </Link>
        </section>
      )
    }

    return (
      <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
          to={ROUTES.EVIDENCE}
        >
          <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
          All evidence records
        </Link>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          Evidence Record
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          What this response demonstrated, and how it fed the candidate's evolving assessment.
        </p>

        <div className="mt-6">
          <EvidenceRecordDetail record={record} />
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
        Evidence System
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
        Evidence Log
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
        Every response captured as evidence during the interview, and how it shaped the candidate's
        assessment. Select a record to see the full question, evidence sought, and response.
      </p>

      <div className="mt-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        <span>
          {capturedCount} of {records.length} captured
        </span>
      </div>

      <div className="mt-6">
        <EvidenceRecordList records={records} />
      </div>

      <div className="mt-8 flex justify-end">
        <Link
          className="inline-flex items-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-semibold text-bg-base transition-colors hover:bg-accent-primary-hover"
          to={ROUTES.RESULTS}
        >
          View Results
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}