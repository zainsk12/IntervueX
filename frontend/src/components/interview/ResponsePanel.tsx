import type { InterviewPhase } from '../../types/interview'

interface ResponsePanelProps {
  phase: InterviewPhase
  value: string
  error: string | null
  onChange: (value: string) => void
  onSubmit: () => void
  onContinue: () => void
}

const BUSY_PHASES: InterviewPhase[] = ['evaluating', 'adapting']

function statusLabel(phase: InterviewPhase): string {
  if (phase === 'evaluating') return 'Evaluating response…'
  if (phase === 'adapting') return 'Updating candidate model…'
  return 'Draft in progress'
}

export function ResponsePanel({
  phase,
  value,
  error,
  onChange,
  onSubmit,
  onContinue,
}: ResponsePanelProps) {
  if (phase === 'complete') {
    return null
  }

  const isBusy = BUSY_PHASES.includes(phase)
  const isNextQuestion = phase === 'next-question'

  return (
    <section className="rounded-lg border border-border-default bg-bg-elevated p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
        Your Response
      </p>

      {isNextQuestion ? (
        <div className="mt-4 flex flex-col items-start gap-3 rounded-md border border-success/30 bg-bg-inset p-4">
          <p className="text-sm text-text-secondary">
            Response evaluated and the candidate model has been updated. Ready to continue.
          </p>
          <button
            className="inline-flex items-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-semibold text-bg-base transition-colors hover:bg-accent-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary"
            onClick={onContinue}
            type="button"
          >
            Continue →
          </button>
        </div>
      ) : (
        <>
          <textarea
            className={`mt-4 min-h-[180px] w-full resize-y rounded-md border bg-surface-default px-3 py-3 text-sm leading-relaxed text-text-primary placeholder:text-text-tertiary transition-colors focus:border-accent-secondary focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary disabled:opacity-60 ${
              error ? 'border-error' : 'border-border-default'
            }`}
            disabled={isBusy}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Walk through your reasoning as you would in a real technical interview — approach, tradeoffs, and edge cases all count as evidence."
            value={value}
          />
          {error ? (
            <p className="mt-2 text-xs text-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
              {isBusy ? statusLabel(phase) : 'Draft in progress'}
            </p>
            <button
              className="inline-flex items-center gap-2 rounded-md bg-accent-primary px-4 py-2 text-sm font-semibold text-bg-base transition-colors hover:bg-accent-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isBusy}
              onClick={onSubmit}
              type="button"
            >
              {isBusy ? statusLabel(phase) : 'Submit Response'}
            </button>
          </div>
        </>
      )}
    </section>
  )
}