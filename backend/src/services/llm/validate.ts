import type { FeedbackTurn, InterviewTurn } from '../../types/llm'

const VALID_SIGNALS = ['strong', 'moderate', 'weak', 'insufficient'] as const

function tryParseJson(raw: string): unknown | null {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * Safe recovery: some models wrap JSON in ```json ... ``` fences even
 * when asked not to. Strip those before giving up.
 */
function stripCodeFences(raw: string): string {
  const trimmed = raw.trim()
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return fenceMatch ? fenceMatch[1] : trimmed
}

/**
 * Parses and validates a raw provider message string into a normalized
 * InterviewTurn. Returns null (never throws) on any malformed input so
 * callers can treat it as a provider failure and fall back safely.
 */
export function parseInterviewTurn(raw: string): InterviewTurn | null {
  let parsed = tryParseJson(raw)
  if (parsed === null) {
    parsed = tryParseJson(stripCodeFences(raw))
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null
  }

  const obj = parsed as Record<string, unknown>

  if (typeof obj.reply !== 'string' || obj.reply.trim().length === 0) return null
  if (
    typeof obj.questionDay !== 'number' ||
    !Number.isInteger(obj.questionDay) ||
    obj.questionDay < 1 ||
    obj.questionDay > 31
  ) {
    return null
  }
  if (typeof obj.topic !== 'string' || obj.topic.trim().length === 0) return null
  if (typeof obj.evidenceNote !== 'string') return null
  if (typeof obj.signal !== 'string' || !VALID_SIGNALS.includes(obj.signal as (typeof VALID_SIGNALS)[number])) {
    return null
  }

  return {
    reply: obj.reply,
    questionDay: obj.questionDay,
    topic: obj.topic,
    evidenceNote: obj.evidenceNote,
    signal: obj.signal as InterviewTurn['signal'],
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/**
 * Parses and validates a raw provider message string into a normalized
 * FeedbackTurn (Phase E — final assessment). Returns null (never throws)
 * on any malformed input so callers can retry/fall back safely, mirroring
 * parseInterviewTurn above.
 */
export function parseFeedback(raw: string): FeedbackTurn | null {
  let parsed = tryParseJson(raw)
  if (parsed === null) {
    parsed = tryParseJson(stripCodeFences(raw))
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return null
  }

  const obj = parsed as Record<string, unknown>

  if (typeof obj.reply !== 'string' || obj.reply.trim().length === 0) return null

  const feedback = obj.feedback
  if (typeof feedback !== 'object' || feedback === null || Array.isArray(feedback)) return null
  const f = feedback as Record<string, unknown>

  if (typeof f.summary !== 'string' || f.summary.trim().length === 0) return null
  if (!isStringArray(f.strengths)) return null
  if (!isStringArray(f.gaps)) return null
  if (!isStringArray(f.next)) return null

  return {
    reply: obj.reply,
    feedback: {
      summary: f.summary,
      strengths: f.strengths,
      gaps: f.gaps,
      next: f.next,
    },
  }
}
