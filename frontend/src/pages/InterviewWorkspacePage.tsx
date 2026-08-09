import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EvidencePanel } from '../components/interview/EvidencePanel'
import { InterviewHeader } from '../components/interview/InterviewHeader'
import { QuestionPanel } from '../components/interview/QuestionPanel'
import { ResponsePanel } from '../components/interview/ResponsePanel'
import { ROUTES } from '../data/routes'
import { useInterviewSession } from '../hooks/useInterviewSession'

export default function InterviewWorkspacePage() {
  const {
    setup,
    status,
    startError,
    retryStart,
    currentQuestion,
    questionIndex,
    totalQuestions,
    phase,
    response,
    responseError,
    evidenceLog,
    handleResponseChange,
    submitResponse,
    advanceToNextQuestion,
  } = useInterviewSession()

  const capturedCount = evidenceLog.filter((entry) => entry.status === 'captured').length

  if (status === 'starting') {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
          Interview Workspace
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-text-primary">Connecting to interviewer…</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          Starting your session and generating the first question.
        </p>
      </section>
    )
  }

  if (status === 'start-error') {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-error">
          Interview Workspace
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-text-primary">Could not start the interview</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          {startError ?? 'Something went wrong reaching the interview service.'}
        </p>
        <button
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-semibold text-bg-base transition-colors hover:bg-accent-primary-hover"
          onClick={retryStart}
          type="button"
        >
          Try Again
        </button>
      </section>
    )
  }

  if (!currentQuestion) {
    return (
      <section className="mx-auto w-full max-w-2xl px-4 py-14 text-center sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
          Interview Workspace
        </p>
        <h1 className="mt-3 text-2xl font-semibold text-text-primary">No questions available</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          Return to Candidate Setup to configure a session before starting the interview.
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

  return (
    <div className="flex flex-col">
      <InterviewHeader
        answeredCount={capturedCount}
        phase={phase}
        questionIndex={questionIndex}
        setup={setup}
        totalQuestions={totalQuestions}
      />

      <div className="mx-auto grid w-full max-w-6xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="flex flex-col gap-5">
          {phase === 'complete' ? (
            <section className="rounded-lg border border-success/30 bg-bg-elevated p-6 text-center sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-success">
                Session Complete
              </p>
              <h2 className="mt-3 text-xl font-semibold text-text-primary">
                All questions answered
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {capturedCount} evidence signal{capturedCount === 1 ? '' : 's'} captured across
                this session.
              </p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  className="inline-flex items-center gap-2 rounded-md border border-border-default px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-default"
                  to={ROUTES.EVIDENCE}
                >
                  View Evidence Log
                </Link>
                <Link
                  className="inline-flex items-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-semibold text-bg-base transition-colors hover:bg-accent-primary-hover"
                  to={ROUTES.RESULTS}
                >
                  View Results
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </section>
          ) : (
            <>
              <QuestionPanel
                phase={phase}
                question={currentQuestion}
                questionIndex={questionIndex}
                totalQuestions={totalQuestions}
              />
              <ResponsePanel
                error={responseError}
                onChange={handleResponseChange}
                onContinue={advanceToNextQuestion}
                onSubmit={submitResponse}
                phase={phase}
                value={response}
              />
            </>
          )}
        </div>

        <EvidencePanel
          evidenceLog={evidenceLog}
          phase={phase}
          question={currentQuestion}
          setup={setup}
        />
      </div>
    </div>
  )
}
