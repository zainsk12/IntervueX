import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FOCUS_AREAS } from '../data/interviewSetup'
import { InterviewApiError, sendInterviewMessage, startInterviewSession } from '../lib/interviewApi'
import {
  buildCandidateInputPayload,
  getCandidateSetupOrDefault,
  getOrCreateSessionId,
  readCurrentQuestion,
  readEvidenceLog,
  readFeedback,
  saveCurrentQuestion,
  saveEvidenceLog,
  saveFeedback,
} from '../lib/interviewSession'
import type { EvidenceLogEntry, InterviewPhase, InterviewQuestion } from '../types/interview'
import type { InterviewFeedback } from '../types/api'

/**
 * Status of the backend session itself, separate from `phase` (which only
 * describes where a single question/answer turn is once a question exists).
 */
export type InterviewSessionStatus = 'starting' | 'active' | 'start-error'

/**
 * The backend only returns a `reply` string per turn — no competency,
 * focus area, or "evidence sought" metadata (that local vocabulary was
 * part of the removed static question bank). To keep the existing
 * Question/Evidence UI intact without inventing new backend data, each
 * backend reply is wrapped into the same InterviewQuestion shape using
 * the candidate's own selected focus areas, rotated per turn.
 */
function buildInterviewQuestion(
  reply: string,
  turnNumber: number,
  focusAreas: InterviewQuestion['focusArea'][],
): InterviewQuestion {
  const rotation = focusAreas.length > 0 ? focusAreas : (['backend'] as InterviewQuestion['focusArea'][])
  const focusArea = rotation[(turnNumber - 1) % rotation.length]
  const focusMeta = FOCUS_AREAS.find((area) => area.value === focusArea)

  return {
    id: `turn-${turnNumber}`,
    meta: `Q-${String(turnNumber).padStart(2, '0')}`,
    competency: focusMeta?.label ?? 'Technical Assessment',
    focusArea,
    prompt: reply,
    evidenceSought: 'Backend-evaluated signal captured from the response to this adaptive question.',
  }
}

export function useInterviewSession() {
  const setup = useMemo(() => getCandidateSetupOrDefault(), [])
  const sessionId = useMemo(() => getOrCreateSessionId(), [])

  const resumedEvidence = useMemo(() => readEvidenceLog(), [])
  const resumedQuestion = useMemo(() => readCurrentQuestion(), [])
  const resumedFeedback = useMemo(() => readFeedback(), [])

  const [status, setStatus] = useState<InterviewSessionStatus>(
    resumedQuestion || resumedFeedback ? 'active' : 'starting',
  )
  const [startError, setStartError] = useState<string | null>(null)

  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(resumedQuestion)
  const [questionNumber, setQuestionNumber] = useState(
    resumedQuestion ? resumedEvidence.length + 1 : 1,
  )
  const [pendingQuestion, setPendingQuestion] = useState<InterviewQuestion | null>(null)
  const [pendingQuestionNumber, setPendingQuestionNumber] = useState<number | null>(null)

  const [phase, setPhase] = useState<InterviewPhase>(resumedFeedback ? 'complete' : 'ready')
  const [response, setResponse] = useState('')
  const [responseError, setResponseError] = useState<string | null>(null)
  const [evidenceLog, setEvidenceLog] = useState<EvidenceLogEntry[]>(resumedEvidence)
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(resumedFeedback)

  const startAttemptedRef = useRef(false)

  const runStart = useCallback(() => {
    setStatus('starting')
    setStartError(null)

    startInterviewSession(sessionId, buildCandidateInputPayload(setup))
      .then((result) => {
        const question = buildInterviewQuestion(result.reply, 1, setup.context.focusAreas)
        setCurrentQuestion(question)
        setQuestionNumber(1)
        saveCurrentQuestion(question)
        setStatus('active')
        setPhase('ready')
      })
      .catch((error: unknown) => {
        const message =
          error instanceof InterviewApiError
            ? error.message
            : 'Could not start the interview. Please try again.'
        setStartError(message)
        setStatus('start-error')
      })
  }, [sessionId, setup])

  // Only auto-start once, and only if nothing was already resumed from a
  // previous mount of this same session (avoids re-appending a duplicate
  // greeting turn on the backend for an already-active session).
  useEffect(() => {
    if (startAttemptedRef.current) return
    startAttemptedRef.current = true
    if (!resumedQuestion && !resumedFeedback) {
      runStart()
    }
  }, [resumedQuestion, resumedFeedback, runStart])

  // The Evidence System reads this from sessionStorage on its own route, so the
  // live log is mirrored there any time it changes.
  useEffect(() => {
    saveEvidenceLog(evidenceLog)
  }, [evidenceLog])

  function handleResponseChange(value: string) {
    setResponse(value)
    if (responseError) {
      setResponseError(null)
    }
    if (phase === 'ready' && value.trim().length > 0) {
      setPhase('answering')
    }
  }

  function submitResponse() {
    if (!currentQuestion || status !== 'active' || phase === 'evaluating' || phase === 'adapting') {
      return
    }

    if (!response.trim()) {
      setResponseError('Enter a response before submitting.')
      return
    }

    const questionId = currentQuestion.id
    const submittedResponse = response.trim()
    const upcomingQuestionNumber = questionNumber + 1

    setPhase('evaluating')
    setEvidenceLog((prev) => [
      ...prev,
      {
        questionId,
        competency: currentQuestion.competency,
        meta: currentQuestion.meta,
        focusArea: currentQuestion.focusArea,
        prompt: currentQuestion.prompt,
        evidenceSought: currentQuestion.evidenceSought,
        response: submittedResponse,
        status: 'pending',
        capturedAt: null,
      },
    ])

    sendInterviewMessage(sessionId, submittedResponse)
      .then((result) => {
        setEvidenceLog((prev) =>
          prev.map((entry) =>
            entry.questionId === questionId
              ? { ...entry, status: 'captured', capturedAt: new Date().toISOString() }
              : entry,
          ),
        )

        if (result.done) {
          const finalFeedback = result.feedback ?? null
          setFeedback(finalFeedback)
          saveFeedback(finalFeedback)
          saveCurrentQuestion(null)
          setPhase('complete')
          return
        }

        const nextQuestion = buildInterviewQuestion(
          result.reply,
          upcomingQuestionNumber,
          setup.context.focusAreas,
        )
        setPendingQuestion(nextQuestion)
        setPendingQuestionNumber(upcomingQuestionNumber)
        setPhase('next-question')
      })
      .catch((error: unknown) => {
        // Roll back the optimistic evidence entry and let the candidate retry
        // without losing their draft response.
        setEvidenceLog((prev) => prev.filter((entry) => entry.questionId !== questionId))
        const message =
          error instanceof InterviewApiError
            ? error.message
            : 'Something went wrong submitting your response. Please try again.'
        setResponseError(message)
        setPhase('answering')
      })
  }

  function advanceToNextQuestion() {
    if (!pendingQuestion || pendingQuestionNumber === null) {
      return
    }
    setCurrentQuestion(pendingQuestion)
    setQuestionNumber(pendingQuestionNumber)
    saveCurrentQuestion(pendingQuestion)
    setPendingQuestion(null)
    setPendingQuestionNumber(null)
    setResponse('')
    setResponseError(null)
    setPhase('ready')
  }

  const totalQuestions = Math.max(setup.configuration.questionCount, questionNumber, evidenceLog.length)

  return {
    setup,
    status,
    startError,
    retryStart: runStart,
    currentQuestion,
    questionIndex: questionNumber - 1,
    totalQuestions,
    phase,
    response,
    responseError,
    evidenceLog,
    feedback,
    handleResponseChange,
    submitResponse,
    advanceToNextQuestion,
  }
}
