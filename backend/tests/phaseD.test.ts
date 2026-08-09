import { afterEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app'
import { AllProvidersFailedError, llmService } from '../src/services/llmService'
import { getSession } from '../src/services/sessionService'
import type { InterviewTurn } from '../src/types/llm'

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

describe('Phase D — interview orchestration / adaptive loop', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts a new session, and the first turn calls llmService for the next question', async () => {
    const app = createApp()
    const sessionId = 'phased-new-session'

    const startRes = await request(app)
      .post('/api/interview')
      .send({ sessionId, candidate: { id: 'CAND-001' } })
    expect(startRes.status).toBe(200)
    expect(startRes.body).toHaveProperty('done', false)

    const spy = vi
      .spyOn(llmService, 'generateInterviewTurn')
      .mockResolvedValueOnce(makeTurn({ questionDay: 7, topic: 'Embeddings Explained' }))

    const turnRes = await request(app).post('/api/interview').send({ sessionId, message: 'My first answer.' })
    expect(turnRes.status).toBe(200)
    expect(turnRes.body).toHaveProperty('reply')
    expect(turnRes.body).toHaveProperty('done', false)
    expect(spy).toHaveBeenCalledTimes(1)

    const session = getSession(sessionId)
    expect(session).toBeDefined()
    // greeting + candidate answer + interviewer question
    expect(session?.conversationHistory.length).toBe(3)
    expect(session?.conversationHistory[1]).toMatchObject({ role: 'candidate', content: 'My first answer.' })
    expect(session?.conversationHistory[2]).toMatchObject({ role: 'interviewer', content: 'Tell me more about that.' })
  })

  it('continues an existing session, persisting the user message and the assistant reply', async () => {
    const app = createApp()
    const sessionId = 'phased-continue'
    await request(app).post('/api/interview').send({ sessionId, candidate: { id: 'CAND-002' } })

    vi.spyOn(llmService, 'generateInterviewTurn').mockResolvedValueOnce(makeTurn({ questionDay: 1, topic: 'Setup' }))
    await request(app).post('/api/interview').send({ sessionId, message: 'answer one' })

    const session = getSession(sessionId)
    expect(session?.conversationHistory.some((t) => t.role === 'candidate' && t.content === 'answer one')).toBe(true)
    expect(session?.conversationHistory.at(-1)?.role).toBe('interviewer')
  })

  it('increments questionsAsked and updates daysCovered/candidateModel from the validated LLM turn', async () => {
    const app = createApp()
    const sessionId = 'phased-evidence'
    await request(app).post('/api/interview').send({ sessionId, candidate: { id: 'CAND-003' } })

    vi.spyOn(llmService, 'generateInterviewTurn').mockResolvedValueOnce(
      makeTurn({ questionDay: 9, topic: 'Vector Databases' }),
    )
    await request(app).post('/api/interview').send({ sessionId, message: 'answer' })

    const session = getSession(sessionId)
    expect(session?.questionsAsked).toBe(1)
    expect(session?.daysCovered.has(9)).toBe(true)
    expect(session?.candidateModel).toHaveProperty('Vector Databases')
  })

  it('includes earlier conversation history in later LLM context calls (adaptive context growth)', async () => {
    const app = createApp()
    const sessionId = 'phased-context-growth'
    await request(app).post('/api/interview').send({ sessionId, candidate: { id: 'CAND-004' } })

    const spy = vi
      .spyOn(llmService, 'generateInterviewTurn')
      .mockResolvedValueOnce(makeTurn({ questionDay: 1, topic: 'A' }))
      .mockResolvedValueOnce(makeTurn({ questionDay: 2, topic: 'B' }))

    await request(app).post('/api/interview').send({ sessionId, message: 'first answer' })
    await request(app).post('/api/interview').send({ sessionId, message: 'second answer' })

    expect(spy).toHaveBeenCalledTimes(2)
    const secondCallContext = spy.mock.calls[1][0]
    expect(secondCallContext.conversationHistory.some((t) => t.content === 'first answer')).toBe(true)
    expect(secondCallContext.questionsAsked).toBe(1)
  })

  it('does not conclude before questionsAsked >= 8 and daysCovered >= 4, and becomes ready once both are met', async () => {
    const app = createApp()
    const sessionId = 'phased-readiness'
    await request(app).post('/api/interview').send({ sessionId, candidate: { id: 'CAND-001' } })

    // 7 turns across only 3 distinct days — must not be ready yet.
    const days = [1, 2, 3, 1, 2, 3, 1]
    const spy = vi.spyOn(llmService, 'generateInterviewTurn')
    for (const day of days) {
      spy.mockResolvedValueOnce(makeTurn({ questionDay: day, topic: `Topic day ${day}` }))
    }

    for (let i = 0; i < days.length; i++) {
      const res = await request(app).post('/api/interview').send({ sessionId, message: `answer ${i}` })
      expect(res.body.readyToConclude).toBe(false)
    }

    let session = getSession(sessionId)
    expect(session?.questionsAsked).toBe(7)
    expect(session?.status).toBe('active')

    // 8th question, 4th distinct day — thresholds now met.
    spy.mockResolvedValueOnce(makeTurn({ questionDay: 4, topic: 'Topic final' }))
    const finalRes = await request(app).post('/api/interview').send({ sessionId, message: 'final answer' })

    expect(finalRes.body.readyToConclude).toBe(true)
    // Phase E: once the backend-owned threshold is met, this turn's response
    // is the real completion — done: true with a populated feedback object.
    expect(finalRes.body.done).toBe(true)
    expect(finalRes.body).toHaveProperty('feedback')
    expect(typeof finalRes.body.feedback.summary).toBe('string')

    session = getSession(sessionId)
    expect(session?.questionsAsked).toBe(8)
    expect(session?.daysCovered.size).toBe(4)
    expect(session?.status).toBe('complete')

    // Once complete, further turns don't call the LLM again or keep incrementing state.
    const turnCountBefore = spy.mock.calls.length
    const afterCompleteRes = await request(app).post('/api/interview').send({ sessionId, message: 'one more thing' })
    expect(afterCompleteRes.body.readyToConclude).toBe(true)
    expect(spy.mock.calls.length).toBe(turnCountBefore)
    expect(getSession(sessionId)?.questionsAsked).toBe(8)
  })

  it('safely falls back to a deterministic question when every LLM provider fails, without crashing the session', async () => {
    const app = createApp()
    const sessionId = 'phased-fallback'
    await request(app).post('/api/interview').send({ sessionId, candidate: { id: 'CAND-002' } })

    vi.spyOn(llmService, 'generateInterviewTurn').mockRejectedValueOnce(
      new AllProvidersFailedError([
        { provider: 'groq', error: 'simulated network failure' },
        { provider: 'mistral', error: 'simulated network failure' },
      ]),
    )

    const res = await request(app).post('/api/interview').send({ sessionId, message: 'answer' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('reply')
    expect(typeof res.body.reply).toBe('string')
    expect(res.body.reply.length).toBeGreaterThan(0)

    const session = getSession(sessionId)
    expect(session?.questionsAsked).toBe(1)
    expect(session?.conversationHistory.at(-1)?.role).toBe('interviewer')
  })

  it('existing session-not-found behavior is preserved for an unknown sessionId', async () => {
    const app = createApp()
    const res = await request(app).post('/api/interview').send({ sessionId: 'phased-never-started', message: 'hi' })
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error')
  })
})
