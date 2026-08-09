/**
 * Types describing the ACTUAL shape of data/curriculum.json.
 */

export interface CurriculumModule {
  n: number
  title: string
  /** Inclusive [startDay, endDay] range covered by this module. */
  days: [number, number]
}

export interface CurriculumDay {
  day: number
  title: string
  type: string
  tools: string[]
  objectives: string[]
}

export interface CurriculumFile {
  cohort: string
  modules: CurriculumModule[]
  days: CurriculumDay[]
}
