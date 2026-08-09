import type { InterviewContext } from '../../types/llm'

/**
 * Builds the system/user prompt pair sent to any provider. Kept provider-
 * agnostic and free of Groq/Mistral-specific concerns.
 */
export function buildInterviewPrompt(context: InterviewContext): { system: string; user: string } {
  const system = [
    'You are IntervueX, an adaptive technical interviewer.',
    "Interview the evidence, not the resume: treat the candidate's profile as a hypothesis to verify, not ground truth.",
    'Respond with ONLY a single JSON object — no prose, no markdown code fences — matching exactly this shape:',
    '{"reply": string, "questionDay": number, "topic": string, "evidenceNote": string, "signal": "strong" | "moderate" | "weak" | "insufficient"}',
    '- reply: the next thing to say to the candidate (a question, or a short acknowledgement followed by a question).',
    '- questionDay: the curriculum day (1-31) this question is most related to.',
    '- topic: a short label for the topic being probed.',
    "- evidenceNote: a brief internal note on what the candidate's prior answer did or did not demonstrate.",
    "- signal: your confidence that the candidate's claimed proficiency here is genuine.",
  ].join('\n')

  const historyText = context.conversationHistory.length
    ? context.conversationHistory.map((turn) => `${turn.role}: ${turn.content}`).join('\n')
    : '(no conversation yet)'

  const curriculumText = context.curriculumDay
    ? `Day ${context.curriculumDay.day} — ${context.curriculumDay.title} (${context.curriculumDay.type}). Objectives: ${context.curriculumDay.objectives.join('; ')}`
    : '(no specific curriculum day targeted yet)'

  const user = [
    `Candidate profile: ${JSON.stringify(context.candidate)}`,
    `Questions asked so far: ${context.questionsAsked}`,
    `Curriculum days already covered: ${context.daysCovered.join(', ') || 'none'}`,
    `Candidate curriculum focus: ${curriculumText}`,
    'Conversation so far:',
    historyText,
    'Produce the next interview turn as the JSON object described in the system prompt.',
  ].join('\n\n')

  return { system, user }
}
