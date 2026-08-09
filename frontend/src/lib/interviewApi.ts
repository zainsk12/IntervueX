import type { InterviewApiResponse } from '../types/api'

/**
 * Base URL for the IntervueX backend (backend/src/config/env.ts defaults
 * PORT to 4000). Override for other environments via VITE_API_BASE_URL.
 */
const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:4000'

const INTERVIEW_ENDPOINT = `${API_BASE_URL}/api/interview`

/**
 * Thrown for any failure talking to the interview backend — network
 * failure, non-2xx response, or an unexpected/malformed payload. `message`
 * is always safe to show directly to the candidate.
 */
export class InterviewApiError extends Error {
  status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = 'InterviewApiError'
    this.status = status
  }
}

function extractErrorMessage(payload: unknown): string | null {
  if (
    payload &&
    typeof payload === 'object' &&
    'error' in payload &&
    typeof (payload as { error?: unknown }).error === 'string'
  ) {
    return (payload as { error: string }).error
  }
  return null
}

async function postInterview(body: Record<string, unknown>): Promise<InterviewApiResponse> {
  let response: Response

  try {
    response = await fetch(INTERVIEW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new InterviewApiError(
      'Could not reach the interview service. Check your connection and try again.',
    )
  }

  let payload: unknown = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    throw new InterviewApiError(
      extractErrorMessage(payload) ?? 'The interview service returned an unexpected error.',
      response.status,
    )
  }

  if (!payload || typeof payload !== 'object' || typeof (payload as { reply?: unknown }).reply !== 'string') {
    throw new InterviewApiError('The interview service returned an unexpected response.')
  }

  return payload as InterviewApiResponse
}

/**
 * Starts an interview session for the given candidate. Idempotent by
 * sessionId on the backend — calling this again for a sessionId that
 * already has a session simply returns that session's state.
 */
export function startInterviewSession(
  sessionId: string,
  candidate: Record<string, unknown>,
): Promise<InterviewApiResponse> {
  return postInterview({ sessionId, candidate })
}

/**
 * Sends a candidate answer for the given session and returns the next
 * backend-generated turn — or, once the interview concludes, the final
 * reply plus structured feedback.
 */
export function sendInterviewMessage(
  sessionId: string,
  message: string,
): Promise<InterviewApiResponse> {
  return postInterview({ sessionId, message })
}
