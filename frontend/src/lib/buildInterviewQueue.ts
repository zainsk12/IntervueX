import { INTERVIEW_QUESTION_BANK } from '../data/interviewQuestions'
import type { CandidateSetupPayload, InterviewQuestion } from '../types/interview'

const MIN_QUESTIONS = 1

/**
 * Selects and orders questions from the static local bank based on the
 * candidate's selected focus areas and configured question count.
 * This is a deterministic, frontend-only stand-in for real adaptive
 * question selection — no AI/backend involved.
 */
export function buildInterviewQueue(setup: CandidateSetupPayload): InterviewQuestion[] {
  const focusAreas = setup.context.focusAreas.length > 0 ? setup.context.focusAreas : null
  const questionCount = Math.max(setup.configuration.questionCount, MIN_QUESTIONS)

  const matched = focusAreas
    ? INTERVIEW_QUESTION_BANK.filter((question) => focusAreas.includes(question.focusArea))
    : []
  const remaining = INTERVIEW_QUESTION_BANK.filter((question) => !matched.includes(question))

  return [...matched, ...remaining].slice(0, questionCount)
}