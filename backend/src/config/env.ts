import 'dotenv/config'

/**
 * Centralized environment configuration.
 *
 * Phase 1: only PORT and CORS_ORIGIN are actually used.
 * GROQ_API_KEY / MISTRAL_API_KEY are read (optionally) so later phases can
 * rely on this module without changing its shape — they are NOT required
 * to be set yet, and nothing in Phase 1 depends on them being present.
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

  // Not used until the LLM Provider Integration phase.
  groqApiKey: readEnv('GROQ_API_KEY'),
  mistralApiKey: readEnv('MISTRAL_API_KEY'),
}

export type Env = typeof env
