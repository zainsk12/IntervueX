import 'dotenv/config'

/**
 * Centralized environment configuration.
 *
 * Phase 1: only PORT and CORS_ORIGIN are actually used.
 * Phase C (LLM Provider Integration): GROQ_API_KEY / MISTRAL_API_KEY and
 * their model overrides are now read and used by the provider layer.
 * Neither key is required to be set for the app to start — an unset key
 * simply causes that provider to fail fast with a controlled error.
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
}

export type Env = typeof env
