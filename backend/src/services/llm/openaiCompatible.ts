import { env } from '../../config/env'
import { LLMProviderError } from './errors'

export interface ChatMessage {
  role: 'system' | 'user'
  content: string
}

export interface CallChatCompletionParams {
  providerName: string
  endpoint: string
  apiKey: string | undefined
  model: string
  messages: ChatMessage[]
  /**
   * Phase F — bounds how long a real provider call may hang before being
   * aborted. Optional so existing tests (which resolve their mocked fetch
   * immediately) are unaffected; defaults to env.llmRequestTimeoutMs.
   */
  timeoutMs?: number
}

/**
 * Calls an OpenAI-compatible chat completions endpoint (Groq and Mistral
 * both expose this shape) and returns the raw message content string.
 *
 * Centralizes network/HTTP-error handling so both providers fail the same
 * safe way. Never logs or returns the API key.
 */
export async function callChatCompletion(params: CallChatCompletionParams): Promise<string> {
  const { providerName, endpoint, apiKey, model, messages, timeoutMs = env.llmRequestTimeoutMs } = params

  if (!apiKey) {
    throw new LLMProviderError(providerName, `${providerName} API key is not configured.`)
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  let response: Response
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    })
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new LLMProviderError(providerName, `${providerName} API call timed out after ${timeoutMs}ms.`)
    }
    throw new LLMProviderError(providerName, `Network error calling ${providerName} API.`, err)
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    const bodyText = await response.text().catch(() => '')
    throw new LLMProviderError(providerName, `${providerName} API returned status ${response.status}.`, bodyText)
  }

  let data: unknown
  try {
    data = await response.json()
  } catch (err) {
    throw new LLMProviderError(providerName, `${providerName} API returned invalid JSON envelope.`, err)
  }

  const content = extractMessageContent(data)
  if (content === undefined) {
    throw new LLMProviderError(providerName, `${providerName} API response did not contain message content.`)
  }

  return content
}

function extractMessageContent(data: unknown): string | undefined {
  if (typeof data !== 'object' || data === null || !('choices' in data)) {
    return undefined
  }
  const choices = (data as { choices: unknown }).choices
  if (!Array.isArray(choices) || choices.length === 0) {
    return undefined
  }
  const first = choices[0]
  if (typeof first !== 'object' || first === null || !('message' in first)) {
    return undefined
  }
  const message = (first as { message: unknown }).message
  if (typeof message !== 'object' || message === null || !('content' in message)) {
    return undefined
  }
  const content = (message as { content: unknown }).content
  return typeof content === 'string' ? content : undefined
}
