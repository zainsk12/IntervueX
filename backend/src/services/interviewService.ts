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
import type { InterviewContext, InterviewTurn } from '../types/llm'
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
  if (readyToConclude) {
    // Mark ready for the completion stage. Phase E owns actual feedback
    // generation — we do not synthesize it here.
    session.status = 'complete'
  }

  return { reply: turn.reply, done: false, readyToConclude }
}
