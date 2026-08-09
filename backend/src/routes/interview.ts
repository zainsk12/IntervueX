import { Router, Request, Response } from 'express'
import { handleTurn, startInterview } from '../services/interviewService'
import { getSession } from '../services/sessionService'
import type { CandidateInput } from '../types/session'

const router = Router()

/**
 * POST /api/interview
 *
 * Phase D (Interview Orchestration / Adaptive Loop): request validation is
 * unchanged from Phase A. Session load/create and all interview
 * orchestration (context building, LLM turn generation, evidence/state
 * updates, backend-owned completion readiness) now live in
 * interviewService — this route stays a thin validation + dispatch layer.
 *
 * Official contract (docs/technical-spec.md):
 *   First request:      { sessionId, candidate }
 *   Subsequent request: { sessionId, message }
 *   Response:            { reply, done } | { reply, done: true, feedback }
 *
 * `done` becomes true, together with a populated `feedback` object, exactly
 * once interviewService's backend-owned completion rule is met (Phase E).
 * `readyToConclude` is included as an additional, non-breaking field so the
 * completion-ready state is visible alongside `done`.
 */
router.post('/', async (req: Request, res: Response) => {
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
    const result = startInterview(sessionId, candidate as CandidateInput)
    return res.status(200).json({ reply: result.reply, done: result.done, readyToConclude: result.readyToConclude })
  }

  // Turn request — the sessionId MUST already exist.
  const session = getSession(sessionId)
  if (!session) {
    return res.status(404).json({
      error: `No active interview session found for sessionId "${sessionId}". Start an interview first by sending a request with "candidate".`,
    })
  }

  try {
    const result = await handleTurn(session, message as string)
    const responseBody: { reply: string; done: boolean; readyToConclude: boolean; feedback?: typeof result.feedback } = {
      reply: result.reply,
      done: result.done,
      readyToConclude: result.readyToConclude,
    }
    if (result.feedback) {
      responseBody.feedback = result.feedback
    }
    return res.status(200).json(responseBody)
  } catch {
    return res.status(500).json({ error: 'Failed to process interview turn.' })
  }
})

export default router
