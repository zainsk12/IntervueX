import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app'

const app = createApp()

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })
})

describe('POST /api/interview', () => {
  it('is reachable and accepts a valid start request', async () => {
    const res = await request(app)
      .post('/api/interview')
      .send({ sessionId: 'abc-123', candidate: { id: 'CAND-001' } })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('reply')
    expect(res.body).toHaveProperty('done', false)
  })

  it('accepts a valid subsequent turn request', async () => {
    const res = await request(app)
      .post('/api/interview')
      .send({ sessionId: 'abc-123', message: 'My answer.' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('reply')
    expect(res.body).toHaveProperty('done', false)
  })

  it('rejects a request missing sessionId', async () => {
    const res = await request(app).post('/api/interview').send({ candidate: {} })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  it('rejects a request with neither candidate nor message', async () => {
    const res = await request(app).post('/api/interview').send({ sessionId: 'abc-123' })
    expect(res.status).toBe(400)
  })

  it('rejects a request with a non-object candidate', async () => {
    const res = await request(app)
      .post('/api/interview')
      .send({ sessionId: 'abc-123', candidate: 'not-an-object' })
    expect(res.status).toBe(400)
  })

  it('does not crash on malformed JSON and responds with an error status', async () => {
    const res = await request(app)
      .post('/api/interview')
      .set('Content-Type', 'application/json')
      .send('{ this is not valid json')
    expect(res.status).toBeGreaterThanOrEqual(400)
    expect(res.status).toBeLessThan(500)
  })
})

describe('unknown routes', () => {
  it('returns 404 for an unregistered route', async () => {
    const res = await request(app).get('/does-not-exist')
    expect(res.status).toBe(404)
  })
})
