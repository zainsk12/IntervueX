import type { CandidateRecord } from './candidate'
import type { CandidateInput } from './session'
import type { CurriculumDay } from './curriculum'

export interface InterviewContextTurn {
  role: 'interviewer' | 'candidate'
  content: string
}

/**
 * Everything the LLM provider layer needs to produce the next interview
 * turn. Built by the orchestration layer (Phase D) from an InterviewSession
 * — this type intentionally has no dependency on session storage itself.
 */
export interface InterviewContext {
  candidate: CandidateRecord | CandidateInput
  conversationHistory: InterviewContextTurn[]
  questionsAsked: number
  daysCovered: number[]
  /** Optional curriculum day the next question should be anchored to. */
  curriculumDay?: CurriculumDay
  /**
   * Lightweight, backend-owned snapshot of what the interview has learned
   * about the candidate so far (Phase D). Optional so existing Phase C
   * callers/tests that only build the original fields keep compiling.
   */
  candidateModel?: Record<string, unknown>
  /** Curriculum days the candidate's own record marks as completed/passed. */
  completedDays?: number[]
  /** Curriculum days the candidate's own record marks as skipped. */
  skippedDays?: number[]
}

export type InterviewSignal = 'strong' | 'moderate' | 'weak' | 'insufficient'

/**
 * Normalized, validated structured output produced by any LLM provider.
 */
export interface InterviewTurn {
  reply: string
  questionDay: number
  topic: string
  evidenceNote: string
  signal: InterviewSignal
}

/**
 * Provider-agnostic abstraction. Interview/orchestration code must depend
 * only on this interface (via llmService), never on a concrete provider.
 */
export interface LLMProvider {
  readonly name: string
  generateInterviewTurn(context: InterviewContext): Promise<InterviewTurn>
}
