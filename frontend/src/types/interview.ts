export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'staff'

export type InterviewType = 'technical' | 'system-design' | 'backend' | 'full-stack'

export type FocusArea =
  | 'dsa'
  | 'backend'
  | 'apis'
  | 'databases'
  | 'system-design'
  | 'cloud-devops'
  | 'frontend'
  | 'architecture'

export type InterviewDifficulty = 'standard' | 'rigorous' | 'expert'

export type InterviewDepth = 'focused' | 'standard' | 'extended'

export interface CandidateProfile {
  name: string
  targetRole: string
  experienceLevel: ExperienceLevel
  resumeFileName: string | null
}

export interface InterviewContext {
  roleContext: string
  interviewType: InterviewType | ''
  focusAreas: FocusArea[]
}

export interface InterviewConfiguration {
  difficulty: InterviewDifficulty
  depth: InterviewDepth
  questionCount: number
}

export interface CandidateSetupPayload {
  candidate: CandidateProfile
  context: InterviewContext
  configuration: InterviewConfiguration
  submittedAt: string
}

export interface CandidateSetupErrors {
  name?: string
  targetRole?: string
  interviewType?: string
  focusAreas?: string
}

export type InterviewPhase =
  | 'ready'
  | 'answering'
  | 'evaluating'
  | 'adapting'
  | 'next-question'
  | 'complete'

export interface InterviewQuestion {
  id: string
  meta: string
  prompt: string
  competency: string
  focusArea: FocusArea
  evidenceSought: string
}

export interface EvidenceLogEntry {
  questionId: string
  competency: string
  meta: string
  status: 'pending' | 'captured'
}