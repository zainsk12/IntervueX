import { useEffect, useMemo, useRef, useState } from 'react'
import { buildInterviewQueue } from '../lib/buildInterviewQueue'
import { getCandidateSetupOrDefault, saveEvidenceLog } from '../lib/interviewSession'
import type { EvidenceLogEntry, InterviewPhase } from '../types/interview'

const EVALUATING_DELAY_MS = 900
const ADAPTING_DELAY_MS = 900

export function useInterviewSession() {
  const setup = useMemo(() => getCandidateSetupOrDefault(), [])
  const questions = useMemo(() => buildInterviewQueue(setup), [setup])

  const [questionIndex, setQuestionIndex] = useState(0)
  const [phase, setPhase] = useState<InterviewPhase>('ready')
  const [response, setResponse] = useState('')
  const [responseError, setResponseError] = useState<string | null>(null)
  const [evidenceLog, setEvidenceLog] = useState<EvidenceLogEntry[]>([])

  const evaluatingTimeoutRef = useRef<number | null>(null)
  const adaptingTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (evaluatingTimeoutRef.current !== null) {
        window.clearTimeout(evaluatingTimeoutRef.current)
      }
      if (adaptingTimeoutRef.current !== null) {
        window.clearTimeout(adaptingTimeoutRef.current)
      }
    }
  }, [])

  const currentQuestion = questions[questionIndex] ?? null

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
    if (!currentQuestion || phase === 'evaluating' || phase === 'adapting') {
      return
    }

    if (!response.trim()) {
      setResponseError('Enter a response before submitting.')
      return
    }

    const questionId = currentQuestion.id
    const submittedResponse = response.trim()
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

    evaluatingTimeoutRef.current = window.setTimeout(() => {
      setPhase('adapting')
      setEvidenceLog((prev) =>
        prev.map((entry) =>
          entry.questionId === questionId
            ? { ...entry, status: 'captured', capturedAt: new Date().toISOString() }
            : entry,
        ),
      )

      adaptingTimeoutRef.current = window.setTimeout(() => {
        setPhase(questionIndex + 1 < questions.length ? 'next-question' : 'complete')
      }, ADAPTING_DELAY_MS)
    }, EVALUATING_DELAY_MS)
  }

  function advanceToNextQuestion() {
    setQuestionIndex((index) => index + 1)
    setResponse('')
    setResponseError(null)
    setPhase('ready')
  }

  return {
    setup,
    questions,
    currentQuestion,
    questionIndex,
    phase,
    response,
    responseError,
    evidenceLog,
    handleResponseChange,
    submitResponse,
    advanceToNextQuestion,
  }
}