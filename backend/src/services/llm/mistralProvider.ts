import { env } from '../../config/env'
import type { InterviewContext, InterviewTurn, LLMProvider } from '../../types/llm'
import { LLMProviderError } from './errors'
import { callChatCompletion } from './openaiCompatible'
import { buildInterviewPrompt } from './prompt'
import { parseInterviewTurn } from './validate'

const MISTRAL_ENDPOINT = 'https://api.mistral.ai/v1/chat/completions'

export interface MistralProviderOverrides {
  apiKey?: string
  model?: string
  endpoint?: string
}

/**
 * Fallback LLM provider. Reads MISTRAL_API_KEY / MISTRAL_MODEL from
 * config by default; overrides accepted for testing without touching
 * env/global fetch state. Implements the same LLMProvider interface as
 * GroqProvider — the rest of the app cannot tell them apart.
 */
export class MistralProvider implements LLMProvider {
  readonly name = 'mistral'

  private readonly apiKey: string | undefined
  private readonly model: string
  private readonly endpoint: string

  constructor(overrides?: MistralProviderOverrides) {
    this.apiKey = overrides?.apiKey ?? env.mistralApiKey
    this.model = overrides?.model ?? env.mistralModel
    this.endpoint = overrides?.endpoint ?? MISTRAL_ENDPOINT
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
      throw new LLMProviderError(this.name, 'Mistral response failed structured-output validation.')
    }
    return turn
  }
}
