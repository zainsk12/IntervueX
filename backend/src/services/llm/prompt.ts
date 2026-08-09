import type { InterviewContext } from '../../types/llm'

/**
 * Builds the system/user prompt pair sent to any provider. Kept provider-
 * agnostic and free of Groq/Mistral-specific concerns.
 */
export function buildInterviewPrompt(context: InterviewContext): { system: string; user: string } {
  const system = [
    'You are IntervueX, an adaptive technical interviewer.',
    "Interview the evidence, not the resume: treat the candidate's profile as a hypothesis to verify, not ground truth.",
    'Interview rules (Phase D — adaptive loop):',
    '- Ask one relevant technical/interview question per turn, adapted to the conversation so far.',
    "- If the candidate's last answer was weak or short, ask a clarifying or simpler follow-up on the same topic.",
    '- If the candidate demonstrated strong understanding, move toward a deeper question or a new topic.',
    '- Avoid repeating a day/topic that has already been adequately covered unless a genuine follow-up is warranted.',
    '- Reference the candidate\'s earlier answers when it makes the question sharper or more natural.',
    '- Use the candidate profile and curriculum context to pick relevant, realistic topics.',
    '- You do NOT decide when the interview ends. Never state or imply the interview is complete — the backend',
    '  alone determines completion; just keep asking the next best question.',
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

  const completedText = context.completedDays?.length ? context.completedDays.join(', ') : 'none on record'
  const skippedText = context.skippedDays?.length ? context.skippedDays.join(', ') : 'none on record'

  const candidateModelText =
    context.candidateModel && Object.keys(context.candidateModel).length > 0
      ? JSON.stringify(context.candidateModel)
      : '(no evidence collected yet — this is early in the interview)'

  const user = [
    `Candidate profile: ${JSON.stringify(context.candidate)}`,
    `Curriculum days candidate completed/passed: ${completedText}`,
    `Curriculum days candidate skipped: ${skippedText}`,
    `Questions asked so far: ${context.questionsAsked}`,
    `Curriculum days already covered in this interview: ${context.daysCovered.join(', ') || 'none'}`,
    `Candidate curriculum focus for this turn: ${curriculumText}`,
    `Current candidate model snapshot (evidence gathered so far): ${candidateModelText}`,
    'Conversation so far:',
    historyText,
    'Produce the next interview turn as the JSON object described in the system prompt.',
  ].join('\n\n')

  return { system, user }
}

/**
 * Builds the system/user prompt pair for the final assessment (Phase E —
 * Completion + Feedback). Reuses the same InterviewContext shape as
 * buildInterviewPrompt above: the transcript, candidate, candidateModel,
 * and days-covered snapshot already contain everything needed to write a
 * session-specific assessment, with no separate context-gathering path.
 */
export function buildFeedbackPrompt(context: InterviewContext): { system: string; user: string } {
  const system = [
    'You are IntervueX, an adaptive technical interviewer. The interview has just concluded and you are now',
    'writing the final assessment for the candidate. Do not ask any further questions.',
    'Base the assessment ONLY on the transcript, evidence notes, and candidate model provided below — never invent',
    "skills, answers, or events that did not occur in this session, and never rely on the candidate's stated",
    'profile alone as evidence of ability.',
    'Do not include chain-of-thought, internal reasoning, provider diagnostics, or any hidden evaluation text —',
    'only content appropriate to show the candidate.',
    'Respond with ONLY a single JSON object — no prose, no markdown code fences — matching exactly this shape:',
    '{"reply": string, "feedback": {"summary": string, "strengths": string[], "gaps": string[], "next": string[]}}',
    '- reply: a short, natural closing message to the candidate — thank them and let them know the interview is complete.',
    "- feedback.summary: a concise, honest summary of the candidate's actual demonstrated performance this session.",
    '- feedback.strengths: concrete strengths actually demonstrated, tied to specific topics/days where possible.',
    '- feedback.gaps: real weaknesses, uncertainties, or areas insufficiently demonstrated — not generic filler.',
    '- feedback.next: concrete next steps directly tied to the gaps identified above.',
    'Arrays may be short, but every entry must be specific to this candidate and this session — never boilerplate.',
  ].join('\n')

  const historyText = context.conversationHistory.length
    ? context.conversationHistory.map((turn) => `${turn.role}: ${turn.content}`).join('\n')
    : '(no conversation recorded)'

  const completedText = context.completedDays?.length ? context.completedDays.join(', ') : 'none on record'
  const skippedText = context.skippedDays?.length ? context.skippedDays.join(', ') : 'none on record'

  const candidateModelText =
    context.candidateModel && Object.keys(context.candidateModel).length > 0
      ? JSON.stringify(context.candidateModel)
      : '(no evidence recorded)'

  const user = [
    `Candidate profile: ${JSON.stringify(context.candidate)}`,
    `Curriculum days candidate completed/passed (prior record): ${completedText}`,
    `Curriculum days candidate skipped (prior record): ${skippedText}`,
    `Total questions asked in this interview: ${context.questionsAsked}`,
    `Curriculum days covered during this interview: ${context.daysCovered.join(', ') || 'none'}`,
    `Accumulated evidence / candidate model gathered during this session: ${candidateModelText}`,
    'Full conversation transcript for this session:',
    historyText,
    'Produce the final assessment as the JSON object described in the system prompt.',
  ].join('\n\n')

  return { system, user }
}
