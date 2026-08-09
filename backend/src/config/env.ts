import 'dotenv/config'

/**
 * Centralized environment configuration.
 *
 * Phase 1: only PORT and CORS_ORIGIN are actually used.
 * Phase C (LLM Provider Integration): GROQ_API_KEY / MISTRAL_API_KEY and
 * their model overrides are now read and used by the provider layer.
 * Neither key is required to be set for the app to start — an unset key
 * simply causes that provider to fail fast with a controlled error.
 * Phase F (Real LLM Integration & Production Wiring): no new secrets —
 * GROQ_API_KEY / MISTRAL_API_KEY now drive real provider calls. Adds one
 * optional non-secret tuning var, LLM_REQUEST_TIMEOUT_MS, so a slow/hung
 * real network call can't stall the interview loop indefinitely.
 */

function readEnv(name: string, fallback?: string): string | undefined {
  const value = process.env[name]
  if (value === undefined || value === '') {
    return fallback
  }
  return value
}

export const env = {
  nodeEnv: readEnv('NODE_ENV', 'development') as string,
  port: Number(readEnv('PORT', '4000')),
  corsOrigin: readEnv('CORS_ORIGIN', 'http://localhost:5173') as string,

  // LLM providers — Phase C.
  groqApiKey: readEnv('GROQ_API_KEY'),
  mistralApiKey: readEnv('MISTRAL_API_KEY'),
  groqModel: readEnv('GROQ_MODEL', 'llama-3.1-8b-instant') as string,
  mistralModel: readEnv('MISTRAL_MODEL', 'mistral-small-latest') as string,

  // Phase F — bounded timeout (ms) for real provider HTTP calls. Not a
  // secret; safe default keeps local/dev usage unaffected if unset.
  llmRequestTimeoutMs: Number(readEnv('LLM_REQUEST_TIMEOUT_MS', '20000')),
}

export type Env = typeof env
