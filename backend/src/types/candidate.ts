/**
 * Types describing the ACTUAL shape of data/candidates.json.
 *
 * Each entry in the "candidates" array has a member profile, a list of
 * cohort missions, and a small set of aggregate signals.
 */

export interface CandidateMission {
  day: number
  title: string
  /** Present when the mission was attempted and graded. */
  passed?: boolean
  /** Present (and true) when the candidate skipped this mission. */
  skipped?: boolean
  attempts?: number
}

export interface CandidateMember {
  id: string
  name: string
  jobRole: string
  yearsExperience: number
  education: string
  status: string
}

export interface CandidateSignals {
  commitDays: number
  missionsCompleted: number
  missionsFirstTry: number
}

export interface CandidateRecord {
  member: CandidateMember
  missions: CandidateMission[]
  signals: CandidateSignals
}

export interface CandidatesFile {
  candidates: CandidateRecord[]
}
