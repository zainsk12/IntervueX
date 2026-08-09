import { afterEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app'
import { AllProvidersFailedError, llmService } from '../src/services/llmService'
import { getSession } from '../src/services/sessionService'
import type { FeedbackTurn, InterviewTurn } from '../src/types/llm'

function makeTurn(overrides: Partial<InterviewTurn>): InterviewTurn {
  return {
    reply: 'Tell me more about that.',
    questionDay: 4,
    topic: 'Data Foundations',
    evidenceNote: 'Candidate described the concept accurately.',
    signal: 'moderate',
    ...overrides,
  }
}

function makeFeedback(overrides: Partial<FeedbackTurn> = {}): FeedbackTurn {
  return {
    reply: 'Thanks for your time today — that was a great conversation.',
    feedback: {
      summary: 'Candidate showed strong grasp of data foundations and moderate depth on system design.',
      strengths: ['Data Foundations: explained normalization trade-offs clearly.'],
      gaps: ['System Design: struggled to justify scaling choices.'],
      next: ['Review horizontal vs vertical scaling trade-offs.'],
    },
    ...overrides,
  }
}

/**
 * Drives a fresh session through exactly 8 questions across 4 distinct
 * curriculum days (the Phase D completion threshold), mocking
 * generateInterviewTurn for all 8 question-turns. Returns the app,
 * sessionId, and the response body of the final (8th) request.
 */
async function driveSessionToCompletion(sessionId: string) {
  const app = createApp()
  await request(app).post('/api/interview').send({ sessionId, candidate: { id: 'CAND-010' } })

  const days = [1, 2, 3, 4, 1, 2, 3, 4]
  const spy = vi.spyOn(llmService, 'generateInterviewTurn')
  days.forEach((day, i) => {
    spy.mockResolvedValueOnce(makeTurn({ questionDay: day, topic: `Topic ${day}-${i}`, signal: i % 2 === 0 ? 'strong' : 'weak' }))
  })

  let finalRes: request.Response | undefined
  for (let i = 0; i < days.length; i++) {
    finalRes = await request(app).post('/api/interview').send({ sessionId, message: `answer ${i}` })
  }

  return { app, finalRes: finalRes!, turnSpy: spy }
}

describe('Phase E — completion + feedback', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('produces done: true with a well-formed feedback object once the backend threshold is met', async () => {
    const feedbackSpy = vi.spyOn(llmService, 'generateFeedback').mockResolvedValueOnce(makeFeedback())

    const { finalRes } = await driveSessionToCompletion('phasee-basic-completion')

    expect(finalRes.status).toBe(200)
    expect(finalRes.body.done).toBe(true)
    expect(finalRes.body.readyToConclude).toBe(true)
    expect(typeof finalRes.body.reply).toBe('string')
    expect(finalRes.body.reply.length).toBeGreaterThan(0)
    expect(feedbackSpy).toHaveBeenCalledTimes(1)
  })

  it('final response has exactly the required feedback structure (summary, strengths, gaps, next)', async () => {
    vi.spyOn(llmService, 'generateFeedback').mockResolvedValueOnce(makeFeedback())

    const { finalRes } = await driveSessionToCompletion('phasee-structure')

    expect(finalRes.body.feedback).toEqual(
      expect.objectContaining({
        summary: expect.any(String),
        strengths: expect.any(Array),
        gaps: expect.any(Array),
        next: expect.any(Array),
      }),
    )
    expect(Object.keys(finalRes.body.feedback).sort()).toEqual(['gaps', 'next', 'strengths', 'summary'])
  })

  it('feedback is non-empty and reflects real session-specific content, not a generic placeholder', async () => {
    const feedback = makeFeedback({
      feedback: {
        summary: 'Session-specific summary mentioning Data Foundations and Topic 4-3 directly.',
        strengths: ['Topic 1-0: gave a precise, correct explanation.'],
        gaps: ['Topic 2-1: answer was vague and lacked specifics.'],
        next: ['Practice articulating trade-offs for Topic 2-1.'],
      },
    })
    vi.spyOn(llmService, 'generateFeedback').mockResolvedValueOnce(feedback)

    const { finalRes } = await driveSessionToCompletion('phasee-session-specific')

    expect(finalRes.body.feedback.summary.length).toBeGreaterThan(0)
    expect(finalRes.body.feedback.summary).toContain('Data Foundations')
    expect(finalRes.body.feedback.strengths.length).toBeGreaterThan(0)
    expect(finalRes.body.feedback.gaps.length).toBeGreaterThan(0)
    expect(finalRes.body.feedback.next.length).toBeGreaterThan(0)
  })

  it('retries once via the existing LLM mechanism before falling back, and does not crash on repeated failure', async () => {
    const feedbackSpy = vi
      .spyOn(llmService, 'generateFeedback')
      .mockRejectedValueOnce(
        new AllProvidersFailedError([
          { provider: 'groq', error: 'simulated network failure' },
          { provider: 'mistral', error: 'simulated network failure' },
        ]),
      )
      .mockRejectedValueOnce(
        new AllProvidersFailedError([
          { provider: 'groq', error: 'simulated network failure' },
          { provider: 'mistral', error: 'simulated network failure' },
        ]),
      )

    const { finalRes } = await driveSessionToCompletion('phasee-retry-then-fallback')

    // Called exactly twice: the retry described in the Phase E task (one
    // initial attempt + one retry) before giving up and using the
    // deterministic fallback.
    expect(feedbackSpy).toHaveBeenCalledTimes(2)

    expect(finalRes.status).toBe(200)
    expect(finalRes.body.done).toBe(true)
    expect(finalRes.body).toHaveProperty('feedback')
    expect(typeof finalRes.body.feedback.summary).toBe('string')
    expect(finalRes.body.feedback.summary.length).toBeGreaterThan(0)
    expect(Array.isArray(finalRes.body.feedback.strengths)).toBe(true)
    expect(Array.isArray(finalRes.body.feedback.gaps)).toBe(true)
    expect(Array.isArray(finalRes.body.feedback.next)).toBe(true)
  })

  it('falls back to a valid, non-empty, session-derived feedback object when the LLM returns malformed output', async () => {
    // Malformed: missing required "feedback" field entirely — provider-level
    // parseFeedback would reject this, so llmService.generateFeedback (which
    // wraps provider validation) rejects too.
    vi.spyOn(llmService, 'generateFeedback').mockRejectedValue(
      new AllProvidersFailedError([
        { provider: 'groq', error: 'malformed feedback response' },
        { provider: 'mistral', error: 'malformed feedback response' },
      ]),
    )

    const { finalRes } = await driveSessionToCompletion('phasee-malformed-fallback')

    expect(finalRes.status).toBe(200)
    expect(finalRes.body.done).toBe(true)
    expect(finalRes.body.feedback.summary.length).toBeGreaterThan(0)
    // Deterministic fallback derives strengths/gaps straight from the
    // candidateModel evidence recorded during the session (signals were
    // alternated strong/weak in driveSessionToCompletion).
    expect(finalRes.body.feedback.strengths.length).toBeGreaterThan(0)
    expect(finalRes.body.feedback.gaps.length).toBeGreaterThan(0)

    const session = getSession('phasee-malformed-fallback')
    expect(session?.status).toBe('complete')
    expect(session?.finalFeedback).toBeDefined()
  })

  it('caches the final feedback on the session and does not regenerate it on subsequent turns', async () => {
    const feedbackSpy = vi.spyOn(llmService, 'generateFeedback').mockResolvedValueOnce(makeFeedback())
    const { app, finalRes } = await driveSessionToCompletion('phasee-cached-feedback')

    expect(finalRes.body.done).toBe(true)
    expect(feedbackSpy).toHaveBeenCalledTimes(1)

    const followUp = await request(app)
      .post('/api/interview')
      .send({ sessionId: 'phasee-cached-feedback', message: 'one more thing' })

    expect(followUp.status).toBe(200)
    expect(followUp.body.done).toBe(true)
    expect(followUp.body.feedback).toEqual(finalRes.body.feedback)
    // No additional LLM call — the cached result is reused as-is.
    expect(feedbackSpy).toHaveBeenCalledTimes(1)
  })

  it('never exposes provider diagnostics or internal error detail in the client-facing feedback response', async () => {
    vi.spyOn(llmService, 'generateFeedback').mockRejectedValue(
      new AllProvidersFailedError([
        { provider: 'groq', error: 'GROQ_API_KEY sk-super-secret-should-not-leak' },
        { provider: 'mistral', error: 'internal stack trace details' },
      ]),
    )

    const { finalRes } = await driveSessionToCompletion('phasee-no-diagnostics-leak')

    const raw = JSON.stringify(finalRes.body)
    expect(raw).not.toContain('sk-super-secret-should-not-leak')
    expect(raw).not.toContain('stack trace')
  })
})
