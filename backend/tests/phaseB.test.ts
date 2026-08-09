import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app'
import { getSession } from '../src/services/sessionService'
import { getCandidateById, listCurriculumDays } from '../src/services/dataService'

describe('Phase B — data service', () => {
  it('loads the real candidates.json and resolves a known candidate by id', () => {
    const candidate = getCandidateById('CAND-001')
    expect(candidate).toBeDefined()
    expect(candidate?.member.name).toBe('Sarah Johnson')
  })

  it('returns undefined for an unknown candidate id', () => {
    expect(getCandidateById('CAND-DOES-NOT-EXIST')).toBeUndefined()
  })

  it('loads the real curriculum.json (31 days)', () => {
    expect(listCurriculumDays().length).toBe(31)
  })
})

describe('Phase B — session management via POST /api/interview', () => {
  const app = createApp()

  it('creates a session on a start request and resolves a known candidate id', async () => {
    const res = await request(app)
      .post('/api/interview')
      .send({ sessionId: 'phaseb-known-candidate', candidate: { id: 'CAND-002' } })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('done', false)

    const session = getSession('phaseb-known-candidate')
    expect(session).toBeDefined()
    expect(session?.candidateResolvedFromDataset).toBe(true)
  })

  it('falls back gracefully for an unknown candidate id without crashing', async () => {
    const res = await request(app)
      .post('/api/interview')
      .send({ sessionId: 'phaseb-unknown-candidate', candidate: { id: 'CAND-DOES-NOT-EXIST', name: 'Nobody' } })

    expect(res.status).toBe(200)

    const session = getSession('phaseb-unknown-candidate')
    expect(session).toBeDefined()
    expect(session?.candidateResolvedFromDataset).toBe(false)
  })

  it('persists conversation history across multiple turn requests for the same sessionId', async () => {
    const sessionId = 'phaseb-history'

    await request(app).post('/api/interview').send({ sessionId, candidate: { id: 'CAND-003' } })
    await request(app).post('/api/interview').send({ sessionId, message: 'first answer' })
    await request(app).post('/api/interview').send({ sessionId, message: 'second answer' })

    const session = getSession(sessionId)
    expect(session).toBeDefined()
    // 1 interviewer greeting + (candidate + interviewer) x 2 turns = 5
    expect(session?.conversationHistory.length).toBe(5)
    expect(session?.conversationHistory[1]).toMatchObject({ role: 'candidate', content: 'first answer' })
    expect(session?.conversationHistory[3]).toMatchObject({ role: 'candidate', content: 'second answer' })
  })

  it('rejects a turn request for an unknown sessionId with a 4xx error and does not create one', async () => {
    const res = await request(app)
      .post('/api/interview')
      .send({ sessionId: 'phaseb-never-started', message: 'hello' })

    expect(res.status).toBeGreaterThanOrEqual(400)
    expect(res.status).toBeLessThan(500)
    expect(res.body).toHaveProperty('error')
    expect(getSession('phaseb-never-started')).toBeUndefined()
  })

  it('does not overwrite an existing session on a repeated start request', async () => {
    const sessionId = 'phaseb-idempotent-start'
    await request(app).post('/api/interview').send({ sessionId, candidate: { id: 'CAND-001' } })
    const before = getSession(sessionId)

    await request(app).post('/api/interview').send({ sessionId, candidate: { id: 'CAND-999' } })
    const after = getSession(sessionId)

    expect(after?.createdAt).toBe(before?.createdAt)
    expect(after?.candidateResolvedFromDataset).toBe(before?.candidateResolvedFromDataset)
  })
})
