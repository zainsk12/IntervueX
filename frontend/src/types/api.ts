/**
 * Types describing the real IntervueX backend's request/response contract
 * for POST /api/interview (see docs/technical-spec.md). Kept separate from
 * the local, UI-only interview types in ./interview.ts.
 *
 * Official contract:
 *   Start:    { sessionId, candidate }        -> { reply, done: false }
 *   Turn:     { sessionId, message }          -> { reply, done: false }
 *   Final:    { sessionId, message }          -> { reply, done: true, feedback }
 */

export interface InterviewFeedback {
  summary: string
  strengths: string[]
  gaps: string[]
  next: string[]
}

export interface InterviewApiResponse {
  reply: string
  done: boolean
  /** Backend-owned completion-readiness flag; additional, non-breaking field. */
  readyToConclude?: boolean
  /** Present exactly once, alongside `done: true`. */
  feedback?: InterviewFeedback
}
