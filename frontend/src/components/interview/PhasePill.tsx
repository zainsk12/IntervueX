import type { InterviewPhase } from '../../types/interview'

const PHASE_LABELS: Record<InterviewPhase, string> = {
  ready: 'Ready',
  answering: 'Answering',
  evaluating: 'Evaluating',
  adapting: 'Adapting',
  'next-question': 'Model Updated',
  complete: 'Complete',
}

const PHASE_STYLES: Record<InterviewPhase, string> = {
  ready: 'border-border-default text-text-secondary',
  answering: 'border-accent-secondary/50 text-accent-secondary',
  evaluating: 'border-accent-primary/40 text-accent-primary',
  adapting: 'border-accent-primary/60 text-accent-primary',
  'next-question': 'border-success/50 text-success',
  complete: 'border-success/60 text-success',
}

const BUSY_PHASES: InterviewPhase[] = ['evaluating', 'adapting']

export function PhasePill({ phase }: { phase: InterviewPhase }) {
  const busy = BUSY_PHASES.includes(phase)

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border bg-bg-inset px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${PHASE_STYLES[phase]}`}
    >
      {busy ? (
        <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      ) : null}
      {PHASE_LABELS[phase]}
    </span>
  )
}