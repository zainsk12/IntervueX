# PROMPTS.md — AI-Assisted Development Log

This file tracks the prompts/instructions used to build IntervueX with AI assistance.

**Important note on completeness:** PROMPTS.md was not maintained from the start of the project.
This version was created retroactively (Step 48) and only includes what can be reliably
reconstructed from:

1. The single Claude conversation this file was generated in (which received a Step 46 review
   package and continued through Steps 47–48), and
2. What is directly observable in the repository itself (code comments, commit-like step markers
   in source files, and the completed-steps checklist embedded in the Step 46 instructions).

Prompts and development sessions conducted elsewhere — other Claude conversations, Gemini,
Cursor, or any other tool/account — are **not** included here because their conversation history
was not available when this file was written. **Those will need to be consolidated into this file
later, once their conversation links/exports are provided.** No conversation URLs have been
fabricated; where a source isn't available, that is stated explicitly rather than invented.

---

## Steps 40–45 — Initial build (not reconstructable from available context)

The Step 46 instructions received in this conversation listed the following steps as already
complete:

- Step 40 — Landing Page
- Step 41 — Candidate Setup
- Step 42 — Interview Workspace
- Step 43 — Evidence System
- Step 44 — Results / Assessment
- Step 45 — End-to-end integration & functional verification

**Status:** Only the step *titles* are known, from the checklist header of the Step 46 prompt
below. The actual prompts/instructions used to build these steps were not part of this
conversation and are **not reconstructable** here. Supporting circumstantial evidence that this
work happened as described exists in the shipped code itself — e.g. an in-code comment in
`frontend/src/lib/interviewSession.ts` referring to "the Step 41 setup payload", and one in
`frontend/src/hooks/useInterviewSession.ts` referring to the Evidence System as "a separate route
from the Interview Workspace" — but these are inferences from the code, not a record of the
original prompts.

*Action needed: if the sessions that produced Steps 40–45 exist in another Claude conversation, or
another tool, paste/export them here (or provide a link) so this section can be completed
accurately.*

---

## Step 46 — Final UI/UX Polish + Responsive QA

**Date context:** received as an uploaded review package (`IntervueX-Review.zip`) at the start of
this conversation.

**Prompt (verbatim, as provided):**

> We are now implementing STEP 46 of IntervueX: Final UI/UX Polish + Responsive QA. Perform a
> final UI/UX polish and responsive QA pass across the complete frontend — audit first, then apply
> polish only where issues actually exist. Prioritized: broken responsive behavior, alignment,
> spacing, typography, control consistency, empty states, navigation consistency. Explicitly
> prohibited: new design system, new dependencies, rewriting business logic, changing routing,
> session/evidence/results behavior, data models, adding backend or AI functionality, or new
> product features. Do not proceed to Step 47/48. End with a structured report (audited, issues
> found, changes made, responsive fixes, files modified, validation results, deferred items).

**What it resulted in:**
- Full audit of Landing, Candidate Setup, Interview Workspace, Evidence, Results, and shared
  layout/components — found the codebase already highly consistent.
- Three narrow, justified fixes:
  - `components/interview/EvidencePanel.tsx` — fixed a session-log row that could overflow instead
    of truncating on narrow widths (missing `min-w-0` on a flex child).
  - `components/interview-setup/ResumeInput.tsx` — fixed a long attached filename that could
    visually collide with the remove (×) button.
  - `components/landing/EvidenceChamberVisual.tsx` — converted the 5-stage evidence-flow grid to a
    Tailwind v4 container query so its column count responds to the card's actual rendered width,
    not the viewport, fixing over-cramped columns once the hero splits into two columns at the
    `lg` breakpoint.
- `npm run lint` and `npm run build` verified clean before and after.
- Flagged `components/PlaceholderPage.tsx` as apparently unused, for follow-up.

---

## Step 47 — Final Frontend Cleanup / Consistency Check

**Prompt (verbatim, as provided):**

> Proceed with STEP 47 — Final Frontend Cleanup / Consistency Check. Do NOT start Step 48 yet.
> Audit for: unused/dead components, files, imports, variables, leftover code; unused
> placeholder/demo code; naming and folder-structure inconsistencies; duplicate
> components/utilities; unused dependencies (only if clearly safe to identify); inconsistent UI
> patterns across pages; broken/unnecessary routes; console warnings or TypeScript issues; any
> other genuinely necessary cleanup. Do not redesign, add features, make speculative changes, or
> modify working code for stylistic preference. Pay particular attention to
> `PlaceholderPage.tsx` — determine if it's truly unused and remove it safely, including any
> now-unused imports/references, if so. Then run `npm run lint` / `npm run build`, verify the five
> routes, and report exactly what changed vs. what was intentionally left unchanged.

**What it resulted in:**
- Confirmed `components/PlaceholderPage.tsx` was never imported anywhere → **deleted**, along with
  its now-unused `PlaceholderPageConfig` type and the also-unused `AppRoutePath` type in
  `types/routes.ts`.
- Found `SectionLabel` defined identically in both `LandingPage.tsx` and `CandidateSetupPage.tsx`
  → extracted into a shared `components/SectionLabel.tsx`.
- Found identical date-formatting logic duplicated as `formatSubmittedAt` (in `SessionSummary.tsx`)
  and `formatCapturedAt` (in `EvidenceRecordDetail.tsx`) → extracted into a shared
  `lib/formatDate.ts`.
- Verified: no unused dependencies, no console statements, no TODO/FIXME markers, no hardcoded
  route strings bypassing the `ROUTES` constant.
- Left unchanged (with reasoning given): an unused `pendingCount` field computed in
  `resultsAssessment.ts` (touching it would mean editing working business logic, out of scope for
  a frontend cleanup pass), and several small per-file `focusLabel`/`focusMeta` lookup helpers
  (too trivial and non-identical to justify consolidating).
- `npm run lint` and `npm run build` verified clean before and after.

---

## Step 48 — Documentation + PROMPTS.md + Final Frontend Audit

**Prompt (verbatim, as provided):**

> We are now at STEP 48 — Documentation + PROMPTS.md + Final Frontend Audit. This is the FINAL
> frontend step. Do a final frontend audit (verify all five pages present/connected, routing
> intact, no regressions from Steps 46–47, no broken imports/dead references/duplicated
> logic/placeholder components/unfinished work — fix only what's clearly necessary). Update/create
> only genuinely necessary documentation. Create/update PROMPTS.md from only what's actually
> verifiable in this conversation and the repo, organized chronologically, marking anything
> unreconstructable, noting that other tools'/accounts' history will be consolidated later, without
> fabricating URLs. Run lint/build, verify routes, do a lightweight navigation sanity check, then
> give a structured final report including whether the frontend can be considered COMPLETE.

**What it resulted in:**
- Final audit: re-ran an unused-export scan (found zero), re-checked for duplicate local function
  names (found zero), cross-checked every `<Link to={...}>` target against the `ROUTES` constant
  (all valid), and reviewed `useInterviewSession.ts` / `buildInterviewQueue.ts` for regressions
  from Steps 46–47 (none found). No new code changes were required by the audit itself.
- Replaced the placeholder root `README.md` (a near-empty UTF-16 stub containing only the title)
  with a real project overview describing the repo layout, current frontend/backend status, and
  how to run the project.
- Replaced `frontend/README.md` (the unmodified default Vite/React/TS template README) with
  project-specific documentation: scripts, the route table, and architecture notes (session
  storage instead of a backend call, local question bank, evidence-coverage-only assessment, design
  tokens, folder structure).
- Created this file, `PROMPTS.md`.
- `docs/FRONTEND_DESIGN_SPEC.md` and `docs/technical-spec.md` were reviewed and left unchanged —
  both were already accurate and project-specific.
- `npm run lint` and `npm run build` verified clean.

---

## How to extend this file

When conversation history from other tools/accounts (Gemini, Cursor, other Claude sessions, etc.)
covering Steps 40–45 or any other undocumented work becomes available, add it as a new dated
section above, following the same format: verbatim prompt (or an explicit note that it's
paraphrased/reconstructed, if the verbatim text isn't available), what it resulted in, and files
touched. Do not backfill prompts from memory or inference — if the exact wording isn't available,
say so.