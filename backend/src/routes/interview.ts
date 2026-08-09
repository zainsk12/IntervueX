import { Router, Request, Response } from 'express'
import { appendCandidateTurn, appendInterviewerTurn, createSession, getSession } from '../services/sessionService'
import type { CandidateInput } from '../types/session'

const router = Router()

/**
 * POST /api/interview
 *
 * Phase B (Data + Session Management): request validation is unchanged
 * from Phase A. This now creates/retrieves real in-memory sessions and
 * persists conversation history across requests. Replies are still
 * placeholders — no LLM calls, no real question generation, no adaptive
 * logic (that is Phase C/D).
 *
 * Official contract (docs/technical-spec.md):
 *   First request:      { sessionId, candidate }
 *   Subsequent request: { sessionId, message }
 *   Response:            { reply, done } | { reply, done: true, feedback }
 */
router.post('/', (req: Request, res: Response) => {
  const body = req.body

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'Request body must be a JSON object.' })
  }

  const { sessionId, candidate, message } = body as {
    sessionId?: unknown
    candidate?: unknown
    message?: unknown
  }

  if (typeof sessionId !== 'string' || sessionId.trim().length === 0) {
    return res.status(400).json({ error: '"sessionId" is required and must be a non-empty string.' })
  }

  const isStartRequest = candidate !== undefined
  const isTurnRequest = message !== undefined

  if (!isStartRequest && !isTurnRequest) {
    return res.status(400).json({
      error: 'Request must include either "candidate" (start) or "message" (turn).',
    })
  }

  if (isStartRequest && (typeof candidate !== 'object' || candidate === null || Array.isArray(candidate))) {
    return res.status(400).json({ error: '"candidate" must be an object.' })
  }

  if (isTurnRequest && typeof message !== 'string') {
    return res.status(400).json({ error: '"message" must be a string.' })
  }

  if (isStartRequest) {
    // Creates the session if sessionId is new; returns the existing one
    // unchanged if a session for this sessionId already exists.
    const session = createSession(sessionId, candidate as CandidateInput)

    const reply =
      "Welcome. Let's begin your interview. (Phase 2 placeholder response — interview logic not yet implemented.)"
    appendInterviewerTurn(session, reply)

    return res.status(200).json({
      reply,
      done: false,
    })
  }

  // Turn request — the sessionId MUST already exist.
  const session = getSession(sessionId)
  if (!session) {
    return res.status(404).json({
      error: `No active interview session found for sessionId "${sessionId}". Start an interview first by sending a request with "candidate".`,
    })
  }

  appendCandidateTurn(session, message as string)

  const reply = 'Thanks for your response. (Phase 2 placeholder response — interview logic not yet implemented.)'
  appendInterviewerTurn(session, reply)

  return res.status(200).json({
    reply,
    done: false,
  })
})

export default router
