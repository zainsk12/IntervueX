import type { InterviewSession } from '../types/session'

/**
 * Phase D — stable, route-facing response contract for a single interview
 * turn. This is deliberately separate from the LLM turn contract
 * (types/llm.ts InterviewTurn + services/llm/validate.ts), which validates
 * what a *provider* returned. This type describes what interviewService
 * hands back to the route, after the LLM turn has already been validated
 * and applied to the session.
 *
 * `done` intentionally stays `false` through Phase D: the technical-spec
 * contract only allows `done: true` together with a `feedback` object, and
 * Phase E (not yet implemented) owns feedback generation. `readyToConclude`
 * is exposed alongside it so the completion-ready state is visible to
 * callers/tests without violating that contract prematurely.
 */
export interface InterviewServiceResult {
  reply: string
  done: boolean
  readyToConclude: boolean
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
