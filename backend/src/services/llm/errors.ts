/**
 * Controlled error raised by an LLMProvider on any failure (network,
 * non-2xx response, malformed envelope, or failed structured-output
 * validation). llmService catches this to drive Groq → Mistral fallback.
 *
 * Never includes the API key. `details` is for diagnostic logging only —
 * route handlers must not echo it back to clients.
 */
export class LLMProviderError extends Error {
  readonly provider: string
  readonly details?: unknown

  constructor(provider: string, message: string, details?: unknown) {
    super(message)
    this.name = 'LLMProviderError'
    this.provider = provider
    this.details = details
  }
}
