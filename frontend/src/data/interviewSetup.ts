import type {
  ExperienceLevel,
  FocusArea,
  InterviewDepth,
  InterviewDifficulty,
  InterviewType,
} from '../types/interview'

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string }[] = [
  { value: 'entry', label: 'Entry level · 0–1 yrs' },
  { value: 'junior', label: 'Junior · 1–3 yrs' },
  { value: 'mid', label: 'Mid level · 3–5 yrs' },
  { value: 'senior', label: 'Senior · 5–8 yrs' },
  { value: 'staff', label: 'Staff / Principal · 8+ yrs' },
]

export const INTERVIEW_TYPES: {
  value: InterviewType
  label: string
  description: string
}[] = [
  {
    value: 'technical',
    label: 'Technical Interview',
    description: 'Core CS fundamentals and general technical proficiency.',
  },
  {
    value: 'system-design',
    label: 'System Design',
    description: 'Architecture, scalability, and tradeoff reasoning.',
  },
  {
    value: 'backend',
    label: 'Backend Engineering',
    description: 'Services, data layers, and backend implementation depth.',
  },
  {
    value: 'full-stack',
    label: 'Full Stack Engineering',
    description: 'End-to-end product and system reasoning.',
  },
]

export const FOCUS_AREAS: { value: FocusArea; label: string; meta: string }[] = [
  { value: 'dsa', label: 'Data Structures & Algorithms', meta: 'DSA' },
  { value: 'backend', label: 'Backend Engineering', meta: 'BE' },
  { value: 'apis', label: 'APIs', meta: 'API' },
  { value: 'databases', label: 'Databases', meta: 'DB' },
  { value: 'system-design', label: 'System Design', meta: 'SYS' },
  { value: 'cloud-devops', label: 'Cloud / DevOps', meta: 'OPS' },
  { value: 'frontend', label: 'Frontend Engineering', meta: 'FE' },
  { value: 'architecture', label: 'Software Architecture', meta: 'ARCH' },
]

export const DIFFICULTY_LEVELS: { value: InterviewDifficulty; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'rigorous', label: 'Rigorous' },
  { value: 'expert', label: 'Expert' },
]

export const DEPTH_LEVELS: { value: InterviewDepth; label: string }[] = [
  { value: 'focused', label: 'Focused' },
  { value: 'standard', label: 'Standard' },
  { value: 'extended', label: 'Extended' },
]

export const QUESTION_COUNT_RANGE = { min: 4, max: 12, default: 6 } as const