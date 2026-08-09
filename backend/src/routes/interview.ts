import { Router, Request, Response } from 'express'

const router = Router()

/**
 * POST /api/interview
 *
 * Phase 1 (Backend Foundation): this does NOT run a real interview yet.
 * It only validates the request shape against the official contract and
 * returns a structurally-compatible dummy response, so later phases can
 * drop real logic in without changing the route contract.
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

  // Phase 1 placeholder — no session state, no LLM call yet.
  const reply = isStartRequest
    ? 'Welcome. Let\'s begin your interview. (Phase 1 placeholder response — interview logic not yet implemented.)'
    : 'Thanks for your response. (Phase 1 placeholder response — interview logic not yet implemented.)'

  return res.status(200).json({
    reply,
    done: false,
  })
})

export default router
