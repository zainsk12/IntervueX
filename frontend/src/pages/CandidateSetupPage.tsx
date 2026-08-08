import { useId, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CompetencyHypothesis } from '../components/interview-setup/CompetencyHypothesis'
import { FocusAreaGrid } from '../components/interview-setup/FocusAreaGrid'
import { FormField } from '../components/interview-setup/FormField'
import { fieldInputClassName, fieldInputErrorClassName } from '../components/interview-setup/inputStyles'
import { ResumeInput } from '../components/interview-setup/ResumeInput'
import { SectionLabel } from '../components/SectionLabel'
import {
  DEPTH_LEVELS,
  DIFFICULTY_LEVELS,
  EXPERIENCE_LEVELS,
  INTERVIEW_TYPES,
  QUESTION_COUNT_RANGE,
} from '../data/interviewSetup'
import { saveCandidateSetup } from '../lib/interviewSession'
import { ROUTES } from '../data/routes'
import type {
  CandidateProfile,
  CandidateSetupErrors,
  FocusArea,
  InterviewConfiguration,
  InterviewContext,
} from '../types/interview'

function SectionCard({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="rounded-lg border border-border-default bg-bg-elevated p-5 sm:p-6">
      <SectionLabel>{title}</SectionLabel>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">{description}</p>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}

const initialCandidate: CandidateProfile = {
  name: '',
  targetRole: '',
  experienceLevel: 'mid',
  resumeFileName: null,
}

const initialContext: InterviewContext = {
  roleContext: '',
  interviewType: '',
  focusAreas: [],
}

const initialConfiguration: InterviewConfiguration = {
  difficulty: 'standard',
  depth: 'standard',
  questionCount: QUESTION_COUNT_RANGE.default,
}

export default function CandidateSetupPage() {
  const navigate = useNavigate()
  const formId = useId()

  const [candidate, setCandidate] = useState<CandidateProfile>(initialCandidate)
  const [context, setContext] = useState<InterviewContext>(initialContext)
  const [configuration, setConfiguration] = useState<InterviewConfiguration>(initialConfiguration)
  const [errors, setErrors] = useState<CandidateSetupErrors>({})

  function toggleFocusArea(value: FocusArea) {
    setContext((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(value)
        ? prev.focusAreas.filter((area) => area !== value)
        : [...prev.focusAreas, value],
    }))
  }

  function validate(): CandidateSetupErrors {
    const nextErrors: CandidateSetupErrors = {}

    if (!candidate.name.trim()) {
      nextErrors.name = 'Candidate name is required.'
    }
    if (!candidate.targetRole.trim()) {
      nextErrors.targetRole = 'Target role is required.'
    }
    if (!context.interviewType) {
      nextErrors.interviewType = 'Select an interview type.'
    }
    if (context.focusAreas.length === 0) {
      nextErrors.focusAreas = 'Select at least one technical focus area.'
    }

    return nextErrors
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    saveCandidateSetup({
      candidate,
      context,
      configuration,
      submittedAt: new Date().toISOString(),
    })

    navigate(ROUTES.INTERVIEW)
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <SectionLabel>Interview initialization</SectionLabel>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
        Candidate Setup
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-text-secondary">
        Provide candidate and role context to initialize an evidence-driven interview session.
      </p>

      <form className="mt-8 space-y-6" noValidate onSubmit={handleSubmit}>
        <SectionCard
          description="Who is being interviewed, and for what role."
          title="Candidate Profile"
        >
          <FormField
            error={errors.name}
            htmlFor={`${formId}-name`}
            label="Candidate Name"
            required
          >
            <input
              className={`${fieldInputClassName} ${errors.name ? fieldInputErrorClassName : ''}`}
              id={`${formId}-name`}
              onChange={(event) => setCandidate((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="e.g. Priya Sharma"
              type="text"
              value={candidate.name}
            />
          </FormField>

          <FormField
            error={errors.targetRole}
            htmlFor={`${formId}-target-role`}
            label="Target Role"
            required
          >
            <input
              className={`${fieldInputClassName} ${
                errors.targetRole ? fieldInputErrorClassName : ''
              }`}
              id={`${formId}-target-role`}
              onChange={(event) =>
                setCandidate((prev) => ({ ...prev, targetRole: event.target.value }))
              }
              placeholder="e.g. Backend Engineer"
              type="text"
              value={candidate.targetRole}
            />
          </FormField>

          <FormField htmlFor={`${formId}-experience`} label="Experience Level">
            <select
              className={fieldInputClassName}
              id={`${formId}-experience`}
              onChange={(event) =>
                setCandidate((prev) => ({
                  ...prev,
                  experienceLevel: event.target.value as CandidateProfile['experienceLevel'],
                }))
              }
              value={candidate.experienceLevel}
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField htmlFor={`${formId}-resume`} label="Resume / CV">
            <ResumeInput
              fileName={candidate.resumeFileName}
              id={`${formId}-resume`}
              onChange={(resumeFileName) =>
                setCandidate((prev) => ({ ...prev, resumeFileName }))
              }
            />
          </FormField>
        </SectionCard>

        <SectionCard
          description="What the interview should probe, and how it should be framed."
          title="Role / Interview Context"
        >
          <FormField
            hint="Optional — paste a job description or short context summary."
            htmlFor={`${formId}-role-context`}
            label="Job Description / Role Context"
          >
            <textarea
              className={fieldInputClassName}
              id={`${formId}-role-context`}
              onChange={(event) =>
                setContext((prev) => ({ ...prev, roleContext: event.target.value }))
              }
              placeholder="Paste relevant job description or role context…"
              rows={4}
              value={context.roleContext}
            />
          </FormField>

          <FormField
            error={errors.interviewType}
            htmlFor={`${formId}-interview-type`}
            label="Interview Type"
            required
          >
            <select
              className={`${fieldInputClassName} ${
                errors.interviewType ? fieldInputErrorClassName : ''
              }`}
              id={`${formId}-interview-type`}
              onChange={(event) =>
                setContext((prev) => ({
                  ...prev,
                  interviewType: event.target.value as InterviewContext['interviewType'],
                }))
              }
              value={context.interviewType}
            >
              <option value="">Select an interview type…</option>
              {INTERVIEW_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            error={errors.focusAreas}
            htmlFor={`${formId}-focus-areas`}
            label="Technical Focus Areas"
            required
          >
            <FocusAreaGrid onToggle={toggleFocusArea} selected={context.focusAreas} />
          </FormField>
        </SectionCard>

        <SectionCard
          description="Lightweight session parameters — can be adjusted later."
          title="Interview Configuration"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField htmlFor={`${formId}-difficulty`} label="Difficulty">
              <select
                className={fieldInputClassName}
                id={`${formId}-difficulty`}
                onChange={(event) =>
                  setConfiguration((prev) => ({
                    ...prev,
                    difficulty: event.target.value as InterviewConfiguration['difficulty'],
                  }))
                }
                value={configuration.difficulty}
              >
                {DIFFICULTY_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField htmlFor={`${formId}-depth`} label="Interview Depth">
              <select
                className={fieldInputClassName}
                id={`${formId}-depth`}
                onChange={(event) =>
                  setConfiguration((prev) => ({
                    ...prev,
                    depth: event.target.value as InterviewConfiguration['depth'],
                  }))
                }
                value={configuration.depth}
              >
                {DEPTH_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField
            hint={`${configuration.questionCount} questions (approx.)`}
            htmlFor={`${formId}-question-count`}
            label="Approximate Question Count"
          >
            <input
              className="w-full accent-[color:var(--color-accent-primary)]"
              id={`${formId}-question-count`}
              max={QUESTION_COUNT_RANGE.max}
              min={QUESTION_COUNT_RANGE.min}
              onChange={(event) =>
                setConfiguration((prev) => ({
                  ...prev,
                  questionCount: Number(event.target.value),
                }))
              }
              type="range"
              value={configuration.questionCount}
            />
          </FormField>
        </SectionCard>

        <CompetencyHypothesis
          candidateName={candidate.name}
          focusAreas={context.focusAreas}
          interviewType={context.interviewType}
          targetRole={candidate.targetRole}
        />

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[10px] text-text-tertiary">route: {ROUTES.INTERVIEW}</p>
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-primary px-5 py-2.5 text-sm font-semibold text-bg-base transition-colors hover:bg-accent-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary sm:w-auto"
            type="submit"
          >
            Start Interview
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  )
}