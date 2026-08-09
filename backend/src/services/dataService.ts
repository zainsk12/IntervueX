import fs from 'node:fs'
import path from 'node:path'
import type { CandidateRecord, CandidatesFile } from '../types/candidate'
import type { CurriculumDay, CurriculumFile, CurriculumModule } from '../types/curriculum'

/**
 * Locates the project-level `data/` directory (containing candidates.json
 * and curriculum.json) by walking up from `startDir`.
 *
 * This is resolved relative to __dirname (not process.cwd()) so it works
 * identically whether the backend is started via `tsx src/server.ts`
 * (dev) or `node dist/src/server.js` (build), even though those two
 * entry points sit at different depths under backend/.
 */
function findDataDir(startDir: string): string {
  let dir = startDir
  for (let i = 0; i < 8; i++) {
    const candidateDir = path.join(dir, 'data')
    if (
      fs.existsSync(path.join(candidateDir, 'candidates.json')) &&
      fs.existsSync(path.join(candidateDir, 'curriculum.json'))
    ) {
      return candidateDir
    }
    const parent = path.dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  throw new Error(
    `Could not locate the "data" directory (expected data/candidates.json and data/curriculum.json) starting from ${startDir}.`,
  )
}

function loadJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as T
}

const dataDir = findDataDir(__dirname)

// Loaded once at module init — never re-read per request.
const candidatesFile = loadJsonFile<CandidatesFile>(path.join(dataDir, 'candidates.json'))
const curriculumFile = loadJsonFile<CurriculumFile>(path.join(dataDir, 'curriculum.json'))

const candidatesById = new Map<string, CandidateRecord>(
  candidatesFile.candidates.map((candidate) => [candidate.member.id, candidate]),
)

const curriculumDaysByDay = new Map<number, CurriculumDay>(
  curriculumFile.days.map((day) => [day.day, day]),
)

/** Looks up a candidate by their member id (e.g. "CAND-001"). */
export function getCandidateById(id: string): CandidateRecord | undefined {
  return candidatesById.get(id)
}

/** Returns all known candidates. */
export function listCandidates(): CandidateRecord[] {
  return candidatesFile.candidates
}

/** Looks up a single curriculum day by its day number. */
export function getCurriculumDay(day: number): CurriculumDay | undefined {
  return curriculumDaysByDay.get(day)
}

/** Returns all curriculum days. */
export function listCurriculumDays(): CurriculumDay[] {
  return curriculumFile.days
}

/** Returns the curriculum's module groupings. */
export function listModules(): CurriculumModule[] {
  return curriculumFile.modules
}

/** Returns the cohort label (e.g. "AI Cohort · 31 days · 8 modules"). */
export function getCohortName(): string {
  return curriculumFile.cohort
}
