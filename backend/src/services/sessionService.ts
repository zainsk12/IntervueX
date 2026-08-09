import type { CandidateRecord } from '../types/candidate'
import type { CandidateInput, ConversationRole, InterviewSession } from '../types/session'
import { getCandidateById } from './dataService'

/**
 * In-memory session store keyed by sessionId.
 *
 * No database, no Redis, no filesystem persistence — sessions live only
 * for the lifetime of the process, per the current architecture.
 */
const sessions = new Map<string, InterviewSession>()

function extractCandidateId(input: CandidateInput): string | undefined {
  if (typeof input.id === 'string' && input.id.trim().length > 0) {
    return input.id
  }
  const memberId = input.member?.id
  if (typeof memberId === 'string' && memberId.trim().length > 0) {
    return memberId
  }
  return undefined
}

function resolveCandidate(input: CandidateInput): {
  candidate: CandidateRecord | CandidateInput
  resolvedFromDataset: boolean
} {
  const id = extractCandidateId(input)
  if (id) {
    const record = getCandidateById(id)
    if (record) {
      return { candidate: record, resolvedFromDataset: true }
    }
  }
  // Unknown or missing id — gracefully fall back to whatever was supplied.
  return { candidate: input, resolvedFromDataset: false }
}

export function sessionExists(sessionId: string): boolean {
  return sessions.has(sessionId)
}

export function getSession(sessionId: string): InterviewSession | undefined {
  return sessions.get(sessionId)
}

/**
 * Creates a session for `sessionId` if one does not already exist.
 * If a session already exists, it is returned unchanged (idempotent).
 */
export function createSession(sessionId: string, candidateInput: CandidateInput): InterviewSession {
  const existing = sessions.get(sessionId)
  if (existing) {
    return existing
  }

  const { candidate, resolvedFromDataset } = resolveCandidate(candidateInput)
  const now = new Date().toISOString()

  const session: InterviewSession = {
    sessionId,
    candidate,
    candidateResolvedFromDataset: resolvedFromDataset,
    conversationHistory: [],
    questionsAsked: 0,
    daysCovered: new Set<number>(),
    candidateModel: {},
    status: 'active',
    createdAt: now,
    updatedAt: now,
  }

  sessions.set(sessionId, session)
  return session
}

function appendTurn(session: InterviewSession, role: ConversationRole, content: string): void {
  session.conversationHistory.push({ role, content, at: new Date().toISOString() })
  session.updatedAt = new Date().toISOString()
}

export function appendInterviewerTurn(session: InterviewSession, content: string): void {
  appendTurn(session, 'interviewer', content)
}

export function appendCandidateTurn(session: InterviewSession, content: string): void {
  appendTurn(session, 'candidate', content)
}

/**
 * Structural helpers for later phases (C/D adaptive orchestration).
 * Not invoked anywhere in Phase B — no adaptive logic is implemented here.
 */
export function incrementQuestionsAsked(session: InterviewSession): void {
  session.questionsAsked += 1
}

export function addDayCovered(session: InterviewSession, day: number): void {
  session.daysCovered.add(day)
}
