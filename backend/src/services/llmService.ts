import type { FeedbackTurn, InterviewContext, InterviewTurn, LLMProvider } from '../types/llm'
import { GroqProvider } from './llm/groqProvider'
import { MistralProvider } from './llm/mistralProvider'

export interface ProviderAttempt {
  provider: string
  error: string
}

/**
 * Raised when every configured provider fails. Carries the per-provider
 * failure reasons so the caller can log/react without swallowing detail.
 */
export class AllProvidersFailedError extends Error {
  readonly attempts: ProviderAttempt[]

  constructor(attempts: ProviderAttempt[]) {
    super('All configured LLM providers failed to produce a valid interview turn.')
    this.name = 'AllProvidersFailedError'
    this.attempts = attempts
  }
}

/**
 * Builds an LLM service backed by an ordered list of providers, tried in
 * order until one succeeds. Accepting the provider list as a parameter
 * (rather than hardcoding Groq/Mistral) keeps this unit-testable without
 * mocking network calls.
 */
export function createLlmService(providers: LLMProvider[]) {
  async function generateInterviewTurn(context: InterviewContext): Promise<InterviewTurn> {
    const attempts: ProviderAttempt[] = []

    for (const provider of providers) {
      try {
        return await provider.generateInterviewTurn(context)
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        attempts.push({ provider: provider.name, error: message })
        // Deliberately not swallowed silently — logged for operator visibility.
        // eslint-disable-next-line no-console
        console.error(`[llmService] provider "${provider.name}" failed: ${message}`)
      }
    }

    throw new AllProvidersFailedError(attempts)
  }

  /**
   * Phase E — same ordered-fallback pattern as generateInterviewTurn, but
   * for the final closing reply + structured feedback. Kept as a sibling
   * function (not a generic helper) so the existing generateInterviewTurn
   * control flow is untouched.
   */
  async function generateFeedback(context: InterviewContext): Promise<FeedbackTurn> {
    const attempts: ProviderAttempt[] = []

    for (const provider of providers) {
      try {
        return await provider.generateFeedback(context)
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        attempts.push({ provider: provider.name, error: message })
        // eslint-disable-next-line no-console
        console.error(`[llmService] provider "${provider.name}" failed to generate feedback: ${message}`)
      }
    }

    throw new AllProvidersFailedError(attempts)
  }

  return { generateInterviewTurn, generateFeedback }
}

/**
 * The single entry point the interview/orchestration layer should use.
 * Groq is tried first (primary), Mistral second (fallback). Neither
 * provider implementation is imported anywhere outside this module and
 * the provider files themselves.
 */
export const llmService = createLlmService([new GroqProvider(), new MistralProvider()])
