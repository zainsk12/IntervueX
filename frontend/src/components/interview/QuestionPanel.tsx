import type { InterviewPhase, InterviewQuestion } from '../../types/interview'
import { PhasePill } from './PhasePill'

interface QuestionPanelProps {
  question: InterviewQuestion
  questionIndex: number
  totalQuestions: number
  phase: InterviewPhase
}

export function QuestionPanel({
  question,
  questionIndex,
  totalQuestions,
  phase,
}: QuestionPanelProps) {
  return (
    <section className="rounded-lg border border-border-default bg-bg-elevated p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-text-tertiary">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-accent-secondary">{question.meta}</span>
          <PhasePill phase={phase} />
        </div>
      </div>

      <span className="mt-3 inline-block rounded-sm border border-border-default bg-surface-default px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-text-secondary">
        {question.competency}
      </span>

      <p className="mt-4 text-lg font-medium leading-snug text-text-primary sm:text-xl">
        {question.prompt}
      </p>
    </section>
  )
}