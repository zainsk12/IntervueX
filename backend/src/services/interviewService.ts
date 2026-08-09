import { listCurriculumDays } from './dataService'
import { llmService } from './llmService'
import {
  addDayCovered,
  appendCandidateTurn,
  appendInterviewerTurn,
  createSession,
  incrementQuestionsAsked,
} from './sessionService'
import { computeReadyToConclude, type InterviewServiceResult } from '../schemas/interview'
import type { CandidateRecord } from '../types/candidate'
import type { CurriculumDay } from '../types/curriculum'
import type { FeedbackTurn, InterviewContext, InterviewSignal, InterviewTurn } from '../types/llm'
import type { CandidateInput, InterviewSession } from '../types/session'

const CLOSING_MESSAGE =
  "Thanks — that's a solid picture across the topics we've covered. I have what I need for this stage of the interview."

function isCandidateRecord(candidate: CandidateRecord | CandidateInput): candidate is CandidateRecord {
  return (
    typeof candidate === 'object' &&
    candidate !== null &&
    'missions' in candidate &&
    Array.isArray((candidate as CandidateRecord).missions)
  )
}

/**
 * Reads completed/skipped curriculum days directly off the candidate's own
 * record (candidates.json missions), when available. Falls back to empty
 * arrays for the loose/unresolved CandidateInput shape — never invents data.
 */
function extractCurriculumProgress(candidate: CandidateRecord | CandidateInput): {
  completedDays: number[]
  skippedDays: number[]
} {
  if (!isCandidateRecord(candidate)) {
    return { completedDays: [], skippedDays: [] }
  }
  const completedDays = candidate.missions.filter((m) => m.passed).map((m) => m.day)
  const skippedDays = candidate.missions.filter((m) => m.skipped).map((m) => m.day)
  return { completedDays, skippedDays }
}

/**
 * Picks the curriculum day the next question should be anchored to:
 * the first day not yet covered in this interview, or (once every day has
 * been touched at least once) the first curriculum day, deterministically.
 * Intentionally simple — no scoring engine.
 */
function selectNextCurriculumDay(daysCovered: Set<number>): CurriculumDay | undefined {
  const days = listCurriculumDays()
  if (days.length === 0) return undefined
  return days.find((d) => !daysCovered.has(d.day)) ?? days[0]
}

function buildInterviewContext(session: InterviewSession): InterviewContext {
  const { completedDays, skippedDays } = extractCurriculumProgress(session.candidate)

  return {
    candidate: session.candidate,
    conversationHistory: session.conversationHistory.map((turn) => ({ role: turn.role, content: turn.content })),
    questionsAsked: session.questionsAsked,
    daysCovered: Array.from(session.daysCovered),
    curriculumDay: selectNextCurriculumDay(session.daysCovered),
    candidateModel: session.candidateModel,
    completedDays,
    skippedDays,
  }
}

/**
 * Safe, deterministic fallback used only when every configured LLM
 * provider fails (network error, missing key, or repeated malformed
 * output). Never crashes the session — always returns a valid turn.
 */
function buildFallbackTurn(context: InterviewContext): InterviewTurn {
  const day = context.curriculumDay
  const reply = day
    ? `Let's talk through Day ${day.day}: ${day.title}. Could you walk me through your approach to ${
        day.objectives[0] ?? 'this area'
      }?`
    : 'Could you walk me through a recent technical challenge you worked on and how you approached it?'

  return {
    reply,
    questionDay: day?.day ?? context.daysCovered[0] ?? 1,
    topic: day?.title ?? 'General technical discussion',
    evidenceNote: 'LLM provider unavailable this turn — fallback question used; no evidence captured.',
    signal: 'insufficient',
  }
}

function applyEvidence(session: InterviewSession, turn: InterviewTurn): void {
  incrementQuestionsAsked(session)
  addDayCovered(session, turn.questionDay)
  session.candidateModel[turn.topic] = {
    day: turn.questionDay,
    signal: turn.signal,
    evidenceNote: turn.evidenceNote,
    updatedAt: new Date().toISOString(),
  }
}

/** Shape actually written into candidateModel by applyEvidence above. */
interface CandidateModelEntry {
  day: number
  signal: InterviewSignal
  evidenceNote: string
  updatedAt: string
}

function isCandidateModelEntry(value: unknown): value is CandidateModelEntry {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as CandidateModelEntry).day === 'number' &&
    typeof (value as CandidateModelEntry).signal === 'string' &&
    typeof (value as CandidateModelEntry).evidenceNote === 'string'
  )
}

/**
 * Strict schema check on a provider's feedback output, on top of the
 * per-provider validation already done in services/llm/validate.ts. Belt
 * and suspenders: interviewService never hands the route a feedback object
 * it hasn't itself re-verified.
 */
function isValidFeedback(result: FeedbackTurn | null | undefined): result is FeedbackTurn {
  if (!result) return false
  if (typeof result.reply !== 'string' || result.reply.trim().length === 0) return false
  const f = result.feedback
  if (typeof f !== 'object' || f === null) return false
  if (typeof f.summary !== 'string' || f.summary.trim().length === 0) return false
  if (!Array.isArray(f.strengths) || !f.strengths.every((s) => typeof s === 'string')) return false
  if (!Array.isArray(f.gaps) || !f.gaps.every((s) => typeof s === 'string')) return false
  if (!Array.isArray(f.next) || !f.next.every((s) => typeof s === 'string')) return false
  return true
}

/**
 * Safe, deterministic feedback used only when the LLM feedback-generation
 * mechanism fails (network error, missing key, or repeated malformed
 * output) even after a retry. Built purely from real session data already
 * on the session — candidateModel evidence and daysCovered — never invents
 * anything about the candidate's performance.
 */
function buildFallbackFeedback(session: InterviewSession): FeedbackTurn {
  const entries = Object.entries(session.candidateModel).filter(([, v]) => isCandidateModelEntry(v)) as Array<
    [string, CandidateModelEntry]
  >

  const strongEntries = entries.filter(([, v]) => v.signal === 'strong' || v.signal === 'moderate')
  const weakEntries = entries.filter(([, v]) => v.signal === 'weak' || v.signal === 'insufficient')

  const strengths = strongEntries.map(
    ([topic, v]) => `${topic} (Day ${v.day}): ${v.evidenceNote || 'demonstrated understanding during the interview.'}`,
  )

  const gaps = weakEntries.map(
    ([topic, v]) =>
      `${topic} (Day ${v.day}): ${v.evidenceNote || 'not sufficiently demonstrated during the interview.'}`,
  )

  const next = weakEntries.length
    ? weakEntries.map(([topic, v]) => `Revisit ${topic} (Day ${v.day}) with focused practice or a follow-up review.`)
    : ['Continue building on demonstrated strengths with progressively harder scenarios.']

  const daysCoveredList = Array.from(session.daysCovered).sort((a, b) => a - b)
  const summary = [
    `Completed ${session.questionsAsked} question${session.questionsAsked === 1 ? '' : 's'} across ${
      session.daysCovered.size
    } curriculum day${session.daysCovered.size === 1 ? '' : 's'} (days ${daysCoveredList.join(', ') || 'none'}).`,
    strongEntries.length
      ? `Showed solid signal on ${strongEntries.length} topic${strongEntries.length === 1 ? '' : 's'}.`
      : 'Signal was mixed across the topics covered.',
    weakEntries.length
      ? `${weakEntries.length} topic${weakEntries.length === 1 ? '' : 's'} need further evidence before they can be confirmed.`
      : 'No major gaps were flagged from this session.',
  ].join(' ')

  return {
    reply: CLOSING_MESSAGE,
    feedback: { summary, strengths, gaps, next },
  }
}

/**
 * STEP — final assessment generation (Phase E). Reuses the existing
 * Phase C llmService/LLMProvider abstraction (never calls Groq/Mistral
 * directly). Retries once on failure/invalid output, then falls back to a
 * deterministic, session-derived assessment — never throws, never leaves
 * the session without a valid result.
 */
async function generateFinalFeedback(session: InterviewSession): Promise<FeedbackTurn> {
  const context = buildInterviewContext(session)

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await llmService.generateFeedback(context)
      if (isValidFeedback(result)) {
        return result
      }
    } catch {
      // Provider/network failure or malformed output — retry once, then
      // fall through to the deterministic fallback below.
    }
  }

  return buildFallbackFeedback(session)
}

function buildGreeting(session: InterviewSession): string {
  const name = isCandidateRecord(session.candidate) ? session.candidate.member.name : undefined
  return name ? `Welcome, ${name}. Let's begin your interview.` : "Welcome. Let's begin your interview."
}

/**
 * STEP 1 (start branch) — loads or creates the session via the existing
 * sessionService (no second session-management system) and returns the
 * opening turn. Does not call the LLM: the adaptive loop begins once the
 * candidate actually responds, in handleTurn below.
 */
export function startInterview(sessionId: string, candidateInput: CandidateInput): InterviewServiceResult {
  const session = createSession(sessionId, candidateInput)
  const greeting = buildGreeting(session)
  appendInterviewerTurn(session, greeting)
  return { reply: greeting, done: false, readyToConclude: session.status === 'complete' }
}

/**
 * STEP 2-5 — the core Phase D adaptive loop for an existing session.
 * Caller (route) is responsible for confirming the session already exists
 * (preserves the existing Phase B 404-on-unknown-session behavior).
 */
export async function handleTurn(session: InterviewSession, message: string): Promise<InterviewServiceResult> {
  if (session.status === 'complete') {
    // Session already concluded on an earlier turn — return the cached
    // final feedback (generated exactly once, below) rather than
    // re-invoking the LLM or re-deriving anything.
    if (session.finalFeedback) {
      return {
        reply: session.finalFeedback.reply,
        done: true,
        readyToConclude: true,
        feedback: session.finalFeedback.feedback,
      }
    }
    // Defensive fallback only: status should never be 'complete' without
    // finalFeedback already set (see below), but never leave the caller
    // without a valid response if that invariant is ever violated.
    return { reply: CLOSING_MESSAGE, done: false, readyToConclude: true }
  }

  appendCandidateTurn(session, message)

  const context = buildInterviewContext(session)

  let turn: InterviewTurn
  try {
    turn = await llmService.generateInterviewTurn(context)
  } catch {
    // Every provider failed (network/config/repeated malformed output) —
    // never crash the interview session because of it.
    turn = buildFallbackTurn(context)
  }

  appendInterviewerTurn(session, turn.reply)
  applyEvidence(session, turn)

  const readyToConclude = computeReadyToConclude(session)
  if (!readyToConclude) {
    return { reply: turn.reply, done: false, readyToConclude: false }
  }

  // Threshold just met on this turn — the backend (not the LLM) decides
  // the interview is complete. Generate the real final assessment now,
  // via the existing llmService/LLMProvider abstraction, and cache it on
  // the session so later turns don't regenerate it.
  session.status = 'complete'
  const final = await generateFinalFeedback(session)
  session.finalFeedback = final

  return { reply: final.reply, done: true, readyToConclude: true, feedback: final.feedback }
}
