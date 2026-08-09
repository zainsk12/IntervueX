import type { InterviewFeedback } from '../types/llm'
import type { InterviewSession } from '../types/session'

/**
 * Stable, route-facing response contract for a single interview turn.
 * This is deliberately separate from the LLM turn contracts
 * (types/llm.ts InterviewTurn/FeedbackTurn + services/llm/validate.ts),
 * which validate what a *provider* returned. This type describes what
 * interviewService hands back to the route, after the LLM turn (or final
 * feedback) has already been validated and applied to the session.
 *
 * `done` stays `false` on every ordinary turn. It becomes `true`, together
 * with a populated `feedback` object, exactly once the backend-owned
 * completion rule (computeReadyToConclude below) is met — matching the
 * official API contract (docs/technical-spec.md) exactly. `readyToConclude`
 * is kept alongside as an additional, non-breaking field.
 */
export interface InterviewServiceResult {
  reply: string
  done: boolean
  readyToConclude: boolean
  feedback?: InterviewFeedback
}

/**
 * Deterministic, backend-owned completion rule (Phase D §5/§8 of the
 * approved plan). The LLM never decides this — it only supplies
 * questionDay/topic/evidenceNote/signal per turn; the backend counts.
 */
export const MIN_QUESTIONS_BEFORE_CONCLUDE = 8
export const MIN_DAYS_COVERED_BEFORE_CONCLUDE = 4

export function computeReadyToConclude(session: Pick<InterviewSession, 'questionsAsked' | 'daysCovered'>): boolean {
  return (
    session.questionsAsked >= MIN_QUESTIONS_BEFORE_CONCLUDE &&
    session.daysCovered.size >= MIN_DAYS_COVERED_BEFORE_CONCLUDE
  )
}
