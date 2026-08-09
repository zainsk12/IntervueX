import { env } from '../../config/env'
import type { FeedbackTurn, InterviewContext, InterviewTurn, LLMProvider } from '../../types/llm'
import { LLMProviderError } from './errors'
import { callChatCompletion } from './openaiCompatible'
import { buildFeedbackPrompt, buildInterviewPrompt } from './prompt'
import { parseFeedback, parseInterviewTurn } from './validate'

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'

export interface GroqProviderOverrides {
  apiKey?: string
  model?: string
  endpoint?: string
}

/**
 * Primary LLM provider. Reads GROQ_API_KEY / GROQ_MODEL from config by
 * default; overrides accepted for testing without touching env/global
 * fetch state.
 */
export class GroqProvider implements LLMProvider {
  readonly name = 'groq'

  private readonly apiKey: string | undefined
  private readonly model: string
  private readonly endpoint: string

  constructor(overrides?: GroqProviderOverrides) {
    this.apiKey = overrides?.apiKey ?? env.groqApiKey
    this.model = overrides?.model ?? env.groqModel
    this.endpoint = overrides?.endpoint ?? GROQ_ENDPOINT
  }

  async generateInterviewTurn(context: InterviewContext): Promise<InterviewTurn> {
    const { system, user } = buildInterviewPrompt(context)

    const content = await callChatCompletion({
      providerName: this.name,
      endpoint: this.endpoint,
      apiKey: this.apiKey,
      model: this.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    })

    const turn = parseInterviewTurn(content)
    if (!turn) {
      throw new LLMProviderError(this.name, 'Groq response failed structured-output validation.')
    }
    return turn
  }

  async generateFeedback(context: InterviewContext): Promise<FeedbackTurn> {
    const { system, user } = buildFeedbackPrompt(context)

    const content = await callChatCompletion({
      providerName: this.name,
      endpoint: this.endpoint,
      apiKey: this.apiKey,
      model: this.model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    })

    const feedback = parseFeedback(content)
    if (!feedback) {
      throw new LLMProviderError(this.name, 'Groq response failed feedback structured-output validation.')
    }
    return feedback
  }
}
