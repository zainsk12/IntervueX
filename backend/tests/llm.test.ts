import fs from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { GroqProvider } from '../src/services/llm/groqProvider'
import { MistralProvider } from '../src/services/llm/mistralProvider'
import { LLMProviderError } from '../src/services/llm/errors'
import { AllProvidersFailedError, createLlmService } from '../src/services/llmService'
import type { InterviewContext, InterviewTurn, LLMProvider } from '../src/types/llm'

const baseContext: InterviewContext = {
  candidate: { id: 'CAND-001' },
  conversationHistory: [],
  questionsAsked: 0,
  daysCovered: [],
}

function mockFetchOnce(response: {
  ok: boolean
  status?: number
  json?: () => Promise<unknown>
  text?: () => Promise<string>
}) {
  const impl = vi.fn().mockResolvedValueOnce({
    ok: response.ok,
    status: response.status ?? (response.ok ? 200 : 500),
    json: response.json ?? (async () => ({})),
    text: response.text ?? (async () => ''),
  } as unknown as Response)
  vi.stubGlobal('fetch', impl)
  return impl
}

describe('Phase C — GroqProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns valid structured output for a well-formed Groq response', async () => {
    const validTurn: InterviewTurn = {
      reply: 'Tell me about a time you optimized a slow SQL query.',
      questionDay: 4,
      topic: 'Structured data processing',
      evidenceNote: 'No prior evidence yet.',
      signal: 'insufficient',
    }
    mockFetchOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify(validTurn) } }] }),
    })

    const provider = new GroqProvider({ apiKey: 'test-groq-key' })
    const result = await provider.generateInterviewTurn(baseContext)
    expect(result).toEqual(validTurn)
  })

  it('rejects an invalid/malformed Groq response instead of crashing', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify({ reply: 'Hi' }) } }] }),
    })

    const provider = new GroqProvider({ apiKey: 'test-groq-key' })
    await expect(provider.generateInterviewTurn(baseContext)).rejects.toBeInstanceOf(LLMProviderError)
  })

  it('throws a controlled error when the API key is missing (no network call)', async () => {
    const provider = new GroqProvider({ apiKey: undefined })
    await expect(provider.generateInterviewTurn(baseContext)).rejects.toBeInstanceOf(LLMProviderError)
  })

  it('throws a controlled error on a non-2xx response', async () => {
    mockFetchOnce({ ok: false, status: 503, text: async () => 'service unavailable' })
    const provider = new GroqProvider({ apiKey: 'test-groq-key' })
    await expect(provider.generateInterviewTurn(baseContext)).rejects.toBeInstanceOf(LLMProviderError)
  })
})

describe('Phase C — MistralProvider', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns valid structured output for a well-formed Mistral response', async () => {
    const validTurn: InterviewTurn = {
      reply: 'Walk me through your vector search implementation.',
      questionDay: 10,
      topic: 'Retrieval & matching',
      evidenceNote: 'No prior evidence yet.',
      signal: 'moderate',
    }
    mockFetchOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: JSON.stringify(validTurn) } }] }),
    })

    const provider = new MistralProvider({ apiKey: 'test-mistral-key' })
    const result = await provider.generateInterviewTurn(baseContext)
    expect(result).toEqual(validTurn)
  })

  it('rejects an invalid/malformed Mistral response instead of crashing', async () => {
    mockFetchOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'not json at all' } }] }),
    })

    const provider = new MistralProvider({ apiKey: 'test-mistral-key' })
    await expect(provider.generateInterviewTurn(baseContext)).rejects.toBeInstanceOf(LLMProviderError)
  })
})

describe('Phase C — llmService (Groq → Mistral fallback)', () => {
  function fakeProvider(name: string, impl: (ctx: InterviewContext) => Promise<InterviewTurn>): LLMProvider {
    return { name, generateInterviewTurn: impl }
  }

  const sampleTurn: InterviewTurn = {
    reply: 'Sample reply',
    questionDay: 1,
    topic: 'Sample topic',
    evidenceNote: 'Sample note',
    signal: 'weak',
  }

  it('uses the primary provider when it succeeds, without calling the fallback', async () => {
    const mistralCalled = vi.fn()
    const groq = fakeProvider('groq', async () => sampleTurn)
    const mistral = fakeProvider('mistral', async () => {
      mistralCalled()
      return sampleTurn
    })

    const service = createLlmService([groq, mistral])
    const result = await service.generateInterviewTurn(baseContext)

    expect(result).toEqual(sampleTurn)
    expect(mistralCalled).not.toHaveBeenCalled()
  })

  it('falls back to Mistral when Groq fails', async () => {
    const groq = fakeProvider('groq', async () => {
      throw new LLMProviderError('groq', 'simulated groq failure')
    })
    const mistral = fakeProvider('mistral', async () => sampleTurn)

    const service = createLlmService([groq, mistral])
    const result = await service.generateInterviewTurn(baseContext)

    expect(result).toEqual(sampleTurn)
  })

  it('throws AllProvidersFailedError with per-provider detail when both fail', async () => {
    const groq = fakeProvider('groq', async () => {
      throw new LLMProviderError('groq', 'simulated groq failure')
    })
    const mistral = fakeProvider('mistral', async () => {
      throw new LLMProviderError('mistral', 'simulated mistral failure')
    })

    const service = createLlmService([groq, mistral])

    await expect(service.generateInterviewTurn(baseContext)).rejects.toBeInstanceOf(AllProvidersFailedError)

    try {
      await service.generateInterviewTurn(baseContext)
      throw new Error('expected rejection')
    } catch (err) {
      expect(err).toBeInstanceOf(AllProvidersFailedError)
      const failure = err as AllProvidersFailedError
      expect(failure.attempts).toEqual([
        { provider: 'groq', error: 'simulated groq failure' },
        { provider: 'mistral', error: 'simulated mistral failure' },
      ])
    }
  })
})

describe('Phase C — architecture guard', () => {
  it('the interview route does not import provider implementations directly', () => {
    const routeSource = fs.readFileSync(path.join(__dirname, '../src/routes/interview.ts'), 'utf-8')
    expect(routeSource).not.toMatch(/groqProvider/i)
    expect(routeSource).not.toMatch(/mistralProvider/i)
  })
})
