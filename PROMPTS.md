# IntervueX — AI Development Prompts

This file documents the AI-assisted development prompts used to build IntervueX, reconstructed
by cross-referencing every source made available for this task.

**Sources inspected for this version:**
- Four Cursor conversation exports (`.json`), decoded directly from their internal binary
  (protobuf) blob format to recover the underlying prompt text:
  - `cursor_chat_intervuex_design_proposal.json`
  - `cursor_chat_intervuex_frontend_implementatio.json`
  - `cursor_chat_intervuex_frontend_implementation.json`
  - `cursor_chat_intervuex_landing_page_design.json`
- `Claude-1.pdf` — shared/exported Claude Chat transcript, titled "Layout refactoring with public
  and workspace components" (`claude.ai/chat/6c2143db-8467-4896-9e75-f2108364478b`)
- `Claude-2.pdf` — shared Claude transcript, titled "Frontend evidence feature implementation"
  (`claude.ai/share/dae02ba0-9fd9-4d7c-9c2e-6e071a3fd6f5`)
- `Claude-3.pdf` — shared Claude transcript, titled "File validation and build process review"
  (`claude.ai/share/99ddbe39-276d-4086-b564-67cfdac20de4`)
- `Gemini.pdf` — Gemini transcript, "Frontend Review: Ready for Backend"
  (`gemini.google.com/app/97ee65146e1925ce`)
- `IntervueX_Progress.md` — used only for chronology/cross-checking, not as a prompt source
- The prior `PROMPTS.md` — used as a starting point; every entry it contained was re-verified
  against the sources above (all Cursor entries matched verbatim; the Claude Steps 46–48 entries
  it had paraphrased are now replaced with fuller verbatim text recovered from `Claude-3.pdf`)
- **The ChatGPT conversation was intentionally NOT reviewed** (its PDF export was not provided,
  and its share link was not accessed), per this task's instructions. No ChatGPT prompt is
  claimed or reconstructed anywhere in this document.

**Sources added in this revision (backend development history, Part II below):** six further
Claude Chat PDF exports, covering the entire backend build from initial planning through final
demo prep. Their `claude.ai/chat/...` share links were also supplied but were **not fetched** (not
accessible to this review) — only the PDF export content is used as evidence for Part II:
- `Claude-1.pdf` — "IntervueX project completion plan" (`claude.ai/chat/ee13c2f8-ce03-4fb6-9cc9-c322613d35ac`)
- `Claude-2.pdf` — "Phase B backend testing and verification" (`claude.ai/chat/bfaaca56-647f-43fa-a79c-8149e8bed045`)
- `Claude-3.pdf` — "Interview service implementation with context fields" (`claude.ai/chat/d99521e9-10b1-4ad6-b791-e05c6fc0cdbf`)
- `Claude-4.pdf` — "Phase E completion verification and testing" (`claude.ai/chat/2dea5618-5c2b-4c03-aaa0-d137b8d94f81`)
- `Claude-5.pdf` — "Frontend file structure inspection" (`claude.ai/chat/7f2266e1-2d32-4b94-9db9-abf7a1606a24`)
- `Claude-6.pdf` — "Frontend integration layer P0 bug review" (`claude.ai/chat/91214b52-6932-4e57-b2aa-4c23e1b223b2`)

(Note: these filenames `Claude-1.pdf`…`Claude-6.pdf` are reused from the newly supplied upload
batch and are unrelated to any identically-named files referenced elsewhere in this document from
an earlier upload batch — titles and chat-share links are given for every entry below to avoid
ambiguity.)

**A note on the PDF exports:** `Claude-1.pdf`'s shared page renders pasted user content as
collapsed "PASTED" cards showing only a short preview, not the full original text — this affects
three prompts in Section 4 below, marked accordingly. `Claude-2.pdf` and `Claude-3.pdf` begin
mid-conversation (the visible transcript opens on an assistant action, not a user turn), so the
prompt that originally started each of those sessions is not present in the export at all.
Nothing has been reconstructed or paraphrased to fill these gaps.

---

## 1. Project Planning & Architecture (Steps 1–14, Steps 15–29)

**Status:** Not reconstructable from the available sources. No Cursor export or Claude/Gemini PDF
covers this phase. `IntervueX_Progress.md` records that this phase established the problem
statement, the Dynamic Candidate Model, the adaptive interview mechanism, the technical
architecture, and the multi-AI development workflow (ChatGPT for architecture/planning, Claude
Code for implementation, Cursor for interactive development, Gemini for review), but the
originating prompts themselves are not recoverable here.

---

## 2. UI/UX & Design Proposal

**AI / Tool:** Cursor (export: `cursor_chat_intervuex_design_proposal.json`)

**Purpose:** Establish a visual design direction for IntervueX before any implementation.

**Prompt (verbatim):**
```text
We are designing IntervueX, a next-generation AI technical interview platform for the ViCodathon
hackathon.

DO NOT write or modify any code yet.

Use the installed UI/UX Pro Max skill and the IntervueX Design System rule.

Create a proposed visual design direction for IntervueX covering:

1. Overall visual concept and design personality
2. Color system
   - Backgrounds
   - Surface colors
   - Primary accent
   - Secondary accent
   - Success/warning/error colors
3. Typography system
   - Display font
   - Heading font
   - Body font
   - Monospace/technical font if useful
4. Spacing system
5. Border-radius strategy
6. Shadow/elevation strategy
7. Button and input visual language
8. Card/container strategy
9. Navigation style
10. Interview interface visual language
11. Candidate evidence/progress visualization
12. Loading, evaluation and adaptive-question states
13. Mobile-first behavior at 390px
14. Micro-interaction and animation principles

IMPORTANT:
- Do not produce a generic AI/SaaS dashboard.
- Avoid automatically choosing the typical purple/blue AI gradient aesthetic.
- Avoid excessive glassmorphism, glowing effects and decorative blobs.
- The visual identity should feel purpose-built for technical interviewing.
- It should feel premium, intelligent, confident and technically sophisticated.
- Prioritize originality through information architecture and interaction design rather than
  visual gimmicks.

Also provide 2–3 alternative visual directions briefly, then recommend the strongest one for
IntervueX and explain why.

Do not implement anything.
Do not create files.
Do not modify the repository.
Only provide the design proposal for review.
```

**Outcome:** A written-only design proposal (no code) titled **"Evidence Chamber"** — a dark,
brass/teal-accented, border-first design language explicitly avoiding generic purple/blue "AI"
gradients, covering color tokens, typography, spacing, radius, shadow, and component language.
Two alternative directions ("Terminal Deposition", "Editorial Examination") were proposed and not
selected. No files were created or modified, per the prompt's constraint.

**Files / Changes:** None (proposal only).

---

## 3. Frontend Foundation (Steps 30–39)

### 3.1 Starter Cleanup

**AI / Tool:** Cursor (export: `cursor_chat_intervuex_frontend_implementatio.json`)

**Purpose:** Strip the default Vite/React/TS starter to a clean shell before any IntervueX screens
are built.

**Prompt (verbatim):**
```text
We are now beginning the actual IntervueX frontend implementation.

Read these files first:
- docs/FRONTEND_DESIGN_SPEC.md
- the "IntervueX Design System" project rule
- the installed UI/UX Pro Max skill
- the existing frontend project structure

For this task ONLY:

1. Inspect the current Vite React + TypeScript starter.
2. Remove the default Vite demo UI and unused starter assets/components.
3. Keep the existing React + Vite + TypeScript + ESLint setup intact.
4. Do NOT install new dependencies.
5. Do NOT create any application screens yet.
6. Do NOT implement the landing page yet.
7. Do NOT modify anything outside the frontend directory.
8. Do NOT change the design tokens in src/index.css.
9. Do NOT modify docs/FRONTEND_DESIGN_SPEC.md.
10. Keep the application compiling successfully.

Create only the minimal clean application shell necessary for us to begin building IntervueX.

After making the changes:
- Run the appropriate build/type-check validation.
- Report exactly which files were created, modified, or deleted.
- Do not make additional improvements beyond this task.
```

**Outcome:** The default Vite demo (counter, hero images, docs/social sections, starter styles)
was removed. `npm run build` passed. Design tokens and everything outside `frontend/` were left
untouched; no dependencies were added.

**Files / Changes:**
- Modified: `frontend/src/App.tsx`, `frontend/index.html`
- Deleted: `frontend/src/App.css`, `frontend/src/assets/vite.svg`, `frontend/src/assets/react.svg`,
  `frontend/public/icons.svg`, `frontend/public/favicon.svg`

---

### 3.2 Step 39 — Application Shell & Routing Foundation

**AI / Tool:** Cursor (export: `cursor_chat_intervuex_frontend_implementation.json`)

**Purpose:** Build the routing skeleton and reusable layout for later pages.

**Prompt (verbatim):**
```text
We are continuing the IntervueX frontend implementation.

Read FIRST:
1. docs/FRONTEND_DESIGN_SPEC.md
2. The "IntervueX Design System" project rule
3. The installed UI/UX Pro Max skill
4. The current frontend source tree

TASK — STEP 39 ONLY:
Build the minimal IntervueX application shell and routing foundation.

Requirements:

1. Create a reusable application layout/shell.
2. Establish React Router routing for these paths:
   /                    → Landing placeholder
   /interview/setup     → Candidate Setup placeholder
   /interview           → Interview Workspace placeholder
   /results             → Results placeholder
   /evidence            → Dynamic Evidence placeholder

3. Create a sensible frontend structure for:
   - layouts
   - pages
   - components
   - data
   - types

4. Use TypeScript throughout.
5. Use the existing Tailwind configuration and IntervueX design tokens.
6. Use Lucide React only where an icon is actually necessary.
7. Do not add dependencies.
8. Do not build the actual Landing Page yet.
9. Do not build the interview UI yet.
10. Do not build Results or Evidence UI yet.
11. Do not implement backend/API logic.
12. Do not create fake business logic.
13. Do not modify docs/FRONTEND_DESIGN_SPEC.md.
14. Do not modify files outside frontend/.
15. Keep the UI intentionally minimal — placeholders are sufficient.
16. Ensure all routes render successfully.
17. Ensure direct navigation to routes works in the Vite development environment.
18. Keep the application responsive.

Suggested structure (adapt only if you have a strong reason):

src/
├── components/
├── layouts/
├── pages/
├── data/
├── types/
├── App.tsx
├── main.tsx
└── index.css

Create reusable route/layout structure rather than duplicating page wrappers.

After implementation:
- Run npm run build.
- Fix any TypeScript/build errors.
- Report every file created, modified, or deleted.
- Do not make additional improvements beyond this task.
```

**Outcome:** A reusable `AppShell` layout (header, nav, main outlet, footer) wrapping all routes;
route constants in `data/routes.ts`, types in `types/routes.ts`. Each page was a thin placeholder
rendered via a shared `PlaceholderPage` component. `npm run build` passed.

*(This `PlaceholderPage` component and the `AppRoutePath`/`PlaceholderPageConfig` types it
introduced here are the same ones later found unused and deleted in Step 47 — see Section 5.2.)*

**Files / Changes:**
- Created: `frontend/src/components/PlaceholderPage.tsx`, `frontend/src/layouts/AppShell.tsx`,
  `frontend/src/pages/LandingPage.tsx`, `frontend/src/pages/CandidateSetupPage.tsx`,
  `frontend/src/pages/InterviewWorkspacePage.tsx`, `frontend/src/pages/ResultsPage.tsx`,
  `frontend/src/pages/EvidencePage.tsx`, `frontend/src/data/routes.ts`,
  `frontend/src/types/routes.ts`
- Modified: `frontend/src/App.tsx`, `frontend/src/main.tsx`

---

## 4. Frontend Implementation (Steps 40–45)

### 4.1 Step 40 — Landing Page

**AI / Tool:** Cursor (export: `cursor_chat_intervuex_landing_page_design.json`)

**Purpose:** Replace the Step 39 landing placeholder with the real product landing page.

**Prompt (verbatim):**
```text
We are now implementing STEP 40 of IntervueX: the Landing Page.

Read FIRST:
1. docs/FRONTEND_DESIGN_SPEC.md
2. The "IntervueX Design System" project rule
3. The installed UI/UX Pro Max skill
4. The existing frontend source tree
5. The existing AppShell and routing implementation

TASK:
Replace ONLY the LandingPage placeholder with the actual IntervueX product landing page.

CORE PRODUCT IDENTITY:
IntervueX is an AI-powered technical interview platform built around evidence-based assessment.

Core philosophy:
"Don't interview the resume. Interview the evidence."

The landing page must communicate that IntervueX is NOT:
- a generic AI chatbot
- a generic coding platform
- a generic SaaS dashboard
- a resume parser with an AI wrapper

It should feel like a serious technical assessment system.

DESIGN DIRECTION:
Use the Evidence Chamber visual language from the design specification.

The design should feel:
- technical
- precise
- analytical
- premium
- trustworthy
- slightly experimental
- evidence-oriented

Avoid:
- generic purple/blue AI gradients
- excessive glassmorphism
- floating blobs
- excessive rounded cards
- stock illustrations
- cartoon graphics
- generic "AI-powered" marketing sections
- excessive animations
- dashboard-like visual clutter
- template-looking SaaS layouts

LANDING PAGE STRUCTURE:

1. HEADER
- IntervueX wordmark
- Minimal navigation
- Appropriate CTA
- Clean, compact layout
- Use Lucide icons only when genuinely useful

2. HERO
Primary message should strongly communicate:
"Don't interview the resume. Interview the evidence."

Supporting copy should explain that IntervueX dynamically adapts technical interviews based on the
candidate's demonstrated knowledge rather than simply following a fixed questionnaire.

Include a strong primary CTA such as:
"Start an Interview"

Include a secondary action if appropriate.

3. EVIDENCE CHAMBER VISUAL
Create a distinctive visual representation of the product's core concept.

It should visually communicate:
Candidate → Question → Response → Evidence → Assessment

This should NOT look like a generic AI chat window.

Use structured panels, evidence markers, technical labels, subtle borders, monospace metadata, and
restrained motion where appropriate.

4. PRODUCT DIFFERENTIATION
Explain the key idea:
Traditional interviews follow a fixed question list.
IntervueX adapts based on evidence gathered during the interview.

Make this visually obvious.

5. HOW IT WORKS
Show a concise flow:

Candidate Profile
→ Initial Assessment
→ Adaptive Interview
→ Evidence Collection
→ Competency Assessment

6. FINAL CTA
End with a focused CTA encouraging the user to start an interview.

IMPLEMENTATION REQUIREMENTS:

- React + TypeScript
- Tailwind CSS using the existing IntervueX design tokens
- Lucide React where appropriate
- Framer Motion only for subtle purposeful transitions
- Fully responsive
- Accessible semantic HTML
- Reusable components where appropriate
- No hardcoded repeated UI structures if a small data-driven approach is cleaner

IMPORTANT:
- Do NOT modify the design tokens in src/index.css.
- Do NOT modify docs/FRONTEND_DESIGN_SPEC.md.
- Do NOT modify backend/.
- Do NOT install dependencies.
- Do NOT modify routing unless required to make the landing page work.
- Do NOT build Candidate Setup, Interview Workspace, Results, or Evidence pages.
- Do NOT add fake backend functionality.
- CTAs can navigate to existing placeholder routes.
- Do NOT create unnecessary files.
- Do NOT use placeholder text such as "Lorem ipsum".
- Do NOT create generic marketing copy.

VISUAL QUALITY:
The result should look intentionally designed, not like a generated starter template.

Use strong hierarchy, controlled spacing, restrained borders, purposeful typography, and the
existing Evidence Chamber palette.

The page must look good at:
- desktop
- tablet
- mobile

Before finishing:
1. Run npm run build.
2. Fix all TypeScript/build errors.
3. Verify the landing page route works.
4. Report files created/modified/deleted.
5. Do not perform additional unrelated improvements.
```

**Outcome:** `LandingPage.tsx` and an `EvidenceChamberVisual` component were built (Framer Motion,
Lucide icons, a landing data file for the evidence-flow stages), with several TypeScript fixes
along the way. **The exported conversation ends mid-troubleshooting** (a sandbox-permission retry
message is the last captured content), so a final "build passed" confirmation is not present in
this export — though the page's later existence and Step 46 polish (Section 5.1) confirm it
shipped.

**Files / Changes:** `frontend/src/pages/LandingPage.tsx`,
`frontend/src/components/landing/EvidenceChamberVisual.tsx`, and an associated landing data file
(full created/modified/deleted list not captured in this export).

---

### 4.2 Layout Refactor — Public / Workspace Layout Split

**AI / Tool:** Claude Chat (`Claude-1.pdf`, informed by an uploaded project ZIP and an independent
Gemini frontend review the user attached)

**Purpose:** Split the single `AppShell` into separate public-facing and workspace layouts.

**Prompt:** Only a truncated preview is present in the export (the PDF renders pasted content as a
collapsed card):
```text
We are continuing development of IntervueX. I have uploaded the current IntervueX project ZIP and
an independent Gemini frontend audit/review. Your t...
```
*(Full original text not recoverable from this source — the export shows only this preview.)*

**Outcome:** Created `PublicLayout.tsx` and `WorkspaceLayout.tsx`, updated `App.tsx` to use both,
and deleted the old `AppShell.tsx`. Type-check, `npm run build`, and `eslint` all passed clean; no
stale `AppShell` references remained.

**Files / Changes:**
- Deleted: `frontend/src/layouts/AppShell.tsx`
- Added: `frontend/src/layouts/PublicLayout.tsx`, `frontend/src/layouts/WorkspaceLayout.tsx`
- Modified: `frontend/src/App.tsx`

---

### 4.3 Candidate Setup Implementation

**AI / Tool:** Claude Chat (`Claude-1.pdf`, same session as 4.2, continued)

**Purpose:** Build the Candidate Setup page and its form system. Chronologically this falls
between Step 40 (Landing) and the explicitly-labeled Step 42 (Interview Workspace, Section 4.4),
so it corresponds to "Step 41" by position — but the prompt text itself does not state a step
number, so that label is not asserted as verbatim.

**Prompt:** Only a truncated preview is present in the export:
```text
We are continuing the IntervueX implementation. IMPORTANT: - This is Claude Chat, NOT Claude Code.
- Do not assume you can directly modify my loc...
```
*(Full original text not recoverable from this source.)*

**Outcome:** Built out `CandidateSetupPage.tsx` and its supporting modules: candidate/interview
types, setup data, session-storage helpers, and a modular form system (`FormField`, `ResumeInput`,
`FocusAreaGrid`, `CompetencyHypothesis`). Build and lint both passed clean.

**Files / Changes:**
- Created/Modified: `frontend/src/pages/CandidateSetupPage.tsx`, `frontend/src/types/interview.ts`,
  `frontend/src/data/interviewSetup.ts`, `frontend/src/lib/interviewSession.ts`,
  `frontend/src/components/interview-setup/FormField.tsx`,
  `frontend/src/components/interview-setup/inputStyles.ts`,
  `frontend/src/components/interview-setup/ResumeInput.tsx`,
  `frontend/src/components/interview-setup/FocusAreaGrid.tsx`,
  `frontend/src/components/interview-setup/CompetencyHypothesis.tsx`

---

### 4.4 Step 42 — Interview Workspace

**AI / Tool:** Claude Chat (`Claude-1.pdf`, same session, continued)

**Purpose:** Build the interview-taking workspace: question flow, response capture, evidence
logging.

**Prompt:** Only a truncated preview is present in the export, though it explicitly names the step:
```text
We are now implementing STEP 42 of IntervueX: INTERVIEW WORKSPACE. IMPORTANT: This is Claude Chat,
not Claude Code. You cannot directly modif...
```
*(Full original text not recoverable from this source.)*

**Outcome:** Added workspace types (question, phase, evidence log) alongside the Step 41 types; a
static local question bank and a frontend-only queue-builder (explicitly no AI/backend); a
workspace session hook; and five new components — `PhasePill`, `InterviewHeader`, `QuestionPanel`,
`ResponsePanel`, `EvidencePanel` — composed into a rewritten `InterviewWorkspacePage`. All routes
served 200; type-check, build, and lint were clean.

**Files / Changes:**
- Created/Modified: `frontend/src/pages/InterviewWorkspacePage.tsx`,
  `frontend/src/types/interview.ts`, `frontend/src/data/interviewQuestions.ts`,
  `frontend/src/lib/interviewSession.ts`, `frontend/src/lib/buildInterviewQueue.ts`,
  `frontend/src/hooks/useInterviewSession.ts`,
  `frontend/src/components/interview/PhasePill.tsx`,
  `frontend/src/components/interview/InterviewHeader.tsx`,
  `frontend/src/components/interview/QuestionPanel.tsx`,
  `frontend/src/components/interview/ResponsePanel.tsx`,
  `frontend/src/components/interview/EvidencePanel.tsx`

---

### 4.5 Pre-Step-43 Structural Readiness Check (Read-Only)

**AI / Tool:** Claude Chat (`Claude-1.pdf`, same session, continued; a fresh project ZIP was
re-uploaded for this review)

**Purpose:** A read-only verification pass confirming the repository was structurally ready for
Step 43, without implementing it.

**Prompt (verbatim):**
```text
I have uploaded the LATEST ZIP of my current IntervueX repository after completing Steps 40, 41,
and 42.
IMPORTANT:
This is NOT a request to implement Step 43.
Do NOT modify, create, delete, rewrite, or generate any project files.
I only want a SHORT, READ-ONLY verification review using the latest uploaded ZIP and the
context/instructions from this same chat.
We previously discussed the hackathon problem-statement/resource files that I downloaded
separately (the .json and .md files containing the hackathon problem statements/modules) and
whether they should be placed inside the repository's /data folder.
Please verify the CURRENT repository and specifically check:
1. DATA / RESOURCE FILE PLACEMENT
- Check whether the existing /data folder is in the correct location.
- Check whether the relevant hackathon problem-statement .json/.md resources are present where
  they should be.
- If they are NOT present, tell me the exact expected path where each type of file should go.
- If they ARE present, verify that their placement and naming are appropriate.
- Do not suggest moving files unnecessarily if their current placement is already correct.
2. STEP 40–42 STRUCTURE
Verify that the modules/files introduced or modified during Steps 40, 41, and 42 are located
correctly according to the architecture established in this chat.
Pay particular attention to:
- src/pages/
- src/components/
- src/components/interview/
- src/data/
- src/hooks/
- src/lib/
- src/types/
- /data
- any docs/specification locations relevant to the project
3. MODULE / ARCHITECTURE CONSISTENCY
Briefly check whether the current module separation is sensible and consistent with the
implementation/specification we established earlier.
Look specifically for:
- misplaced files
- duplicate modules
- incorrect imports/paths
- files that appear to belong in another module
- missing files that are required by the current Step 40–42 implementation
- unnecessary duplication
4. STEP 43 READINESS
Do NOT implement Step 43.
Only determine whether the current repository is structurally ready to proceed to Step 43.
5. BUG / ISSUE CHECK
Do a lightweight review for obvious issues that could cause problems in the next step:
- broken imports
- wrong paths
- missing dependencies between modules
- accidental duplicate files
- obvious architectural inconsistencies
CONSTRAINTS:
- READ-ONLY REVIEW ONLY.
- Do not modify any files.
- Do not generate replacement files.
- Do not provide code unless absolutely necessary to identify a specific issue.
- Do not perform a broad code audit.
- Do not repeat the full project architecture.
- Do not give a general summary of Steps 40–42.
- Do not waste tokens explaining things that are already correct.
OUTPUT ONLY:
### Required Fixes
List ONLY things that actually need to be fixed, with:
- Issue
- Exact file/path involved
- What I should do
### Optional / Can Leave As-Is
Only list genuinely optional improvements that are relevant to the next step.
### Verdict
Give exactly one:
READY FOR STEP 43
or
NOT READY FOR STEP 43
Keep the entire response concise because I have limited remaining session usage.
```

**Outcome:** Not recoverable — the assistant's response in this export ends immediately after
beginning the repository examination ("Examined uploaded repository structure for file placement
verification"); the actual findings and verdict are not present in the captured transcript.

**Files / Changes:** None (read-only review by design).

---

### 4.6 Evidence System & Results/Assessment Implementation

**AI / Tool:** Claude Chat (`Claude-2.pdf`)

**Purpose:** Build the Evidence System (evidence record list/detail views, evidence persistence)
and the Results/Assessment system. This corresponds to the "Evidence System" and "Results /
Assessment" frontend modules named in `IntervueX_Progress.md`'s Steps 40–45 implementation phase.

**Prompt:** Not recoverable — the export opens mid-conversation, on an assistant action
("Ran 4 commands, viewed 3 files... This is the backend API contract, not much on evidence UI
specifics.") rather than on a user turn. The initiating instruction is not present in this export.

**Outcome:** Extended `lib/interviewSession.ts` and `useInterviewSession.ts` to build and persist
full evidence records, resetting them on a new candidate setup. Built `EvidenceRecordList.tsx` and
`EvidenceRecordDetail.tsx`, and replaced the `EvidencePage.tsx` placeholder with the real Evidence
System, plus a small integration change linking Interview Workspace completion to the Evidence Log.
Separately, built the Results/Assessment system: `types/results.ts`, `lib/resultsAssessment.ts`
(pure frontend logic deriving an evidence-based assessment summary from session data — explicitly
without fabricating any data), and five `components/results/` components
(`AssessmentOverview`, `CompetencyAssessmentList`, `EvidenceHighlights`, `EvidenceCoverageList`,
`SessionSummary`) composed into a rebuilt `ResultsPage.tsx`. Type-check, lint, and build all
passed for both efforts; no routing changes were needed.

**Files / Changes:**
- New: `frontend/src/components/evidence/EvidenceRecordList.tsx`,
  `frontend/src/components/evidence/EvidenceRecordDetail.tsx`,
  `frontend/src/pages/ResultsPage.tsx`, `frontend/src/types/results.ts`,
  `frontend/src/lib/resultsAssessment.ts`,
  `frontend/src/components/results/AssessmentOverview.tsx`,
  `frontend/src/components/results/CompetencyAssessmentList.tsx`,
  `frontend/src/components/results/EvidenceHighlights.tsx`,
  `frontend/src/components/results/EvidenceCoverageList.tsx`,
  `frontend/src/components/results/SessionSummary.tsx`
- Modified: `frontend/src/pages/EvidencePage.tsx`, `frontend/src/pages/InterviewWorkspacePage.tsx`,
  `frontend/src/hooks/useInterviewSession.ts`, `frontend/src/lib/interviewSession.ts`,
  `frontend/src/types/interview.ts`

---

### 4.7 Step 45 — End-to-End Frontend Integration & Functional Verification

**AI / Tool:** Claude Chat (`Claude-2.pdf`, same session, continued)

**Purpose:** Integration review of the already-built frontend modules, fixing only what breaks the
intended user journey — explicitly not a new feature pass.

**Prompt (verbatim):**
```text
We are now doing STEP 45 of InterviewX: END-TO-END FRONTEND INTEGRATION & FUNCTIONAL
VERIFICATION.
IMPORTANT:
This is NOT a new feature implementation.
Do not redesign the application.
Do not add unnecessary features.
Do not introduce backend/API/AI functionality.
The major frontend modules are already implemented:
1. Landing Page
2. Candidate Setup
3. Interview Workspace
4. Evidence System
5. Results / Assessment
The current application is a frontend-only implementation using the existing session/local state
architecture.
YOUR TASK:
Perform a focused end-to-end integration review of the EXISTING frontend and fix only issues that
prevent the intended user journey from working correctly.
EXPECTED USER FLOW:
Landing Page
→ Candidate Setup
→ configure candidate/interview
→ Start Interview
→ Interview Workspace
→ questions/responses/evidence captured
→ Evidence System
→ Results / Assessment
REVIEW THE ACTUAL CODEBASE FIRST.
Pay particular attention to:
- routing
- session initialization
- session persistence
- Candidate Setup → Interview Workspace transition
- question queue initialization
- question progression
- response capture
- evidence capture
- evidence persistence
- Interview Workspace completion state
- Evidence page reading the same session data
- Results page reading the same session/evidence data
- navigation between modules
- empty/incomplete states
- stale or duplicated state
- broken imports
- dead references to old architecture
- accidental placeholder content remaining in major modules
- TypeScript issues
- runtime issues
- build/lint issues
CRITICAL PRODUCT REQUIREMENT:
There must be ONE coherent frontend session/evidence flow.
Do NOT create duplicate session stores or parallel data models.
The Results / Assessment system must not fabricate evidence or unsupported assessment data.
The Evidence System and Results System must consume the actual interview session/evidence data
already captured by the application.
TEST THESE STATES:
1. Fresh application with no session
2. Candidate Setup with incomplete required fields
3. Valid Candidate Setup
4. Starting an interview
5. Moving through interview questions
6. Capturing a response
7. Evidence being created/persisted
8. Evidence page displaying captured evidence
9. Results page displaying the available assessment
10. Refreshing the page where applicable and verifying expected persistence
11. Returning between Candidate Setup / Interview / Evidence / Results
12. Completing the interview
DO NOT modify unrelated UI.
If you find an issue:
- fix the smallest possible amount of code;
- preserve the existing architecture and design system;
- do not rewrite working modules unnecessarily.
After fixes, run:
- type-check
- lint
- production build
Also verify that these routes still resolve:
/
/interview/setup
/interview
/evidence
/results
IMPORTANT OUTPUT RULES:
Do NOT give me:
- a long summary
- an audit report
- explanations
- recommendations
- unnecessary markdown
- the entire project ZIP
Only provide files that were ACTUALLY MODIFIED or NEWLY CREATED during this step.
For every modified/new file:
- provide it as a downloadable file
- show its exact project-relative path
If NO files need modification, simply state that no files were changed.
Do not provide unchanged files.
Do not paste source code into the chat.
Do not create documentation files.
The goal is to use this step only for final integration verification and necessary fixes while
preserving the existing implementation.
```

**Outcome:** Found and fixed one real integration bug: `useInterviewSession.ts`'s `evidenceLog` /
`questionIndex` / `phase` never hydrated from the persisted evidence log on mount, so navigating
away from the Interview Workspace (to Evidence/Results) and back — or refreshing — reset progress
to question 1 and silently overwrote previously captured evidence in `sessionStorage`. Fixed by
resuming from persisted state on mount. Type-check, lint, and build all passed; all five routes
resolved correctly. No other files required changes.

**Files / Changes:**
- Modified: `frontend/src/hooks/useInterviewSession.ts`

---

## 5. Frontend Audit & Cleanup (Steps 46–48)

All three entries below are from the same Claude Chat session (`Claude-3.pdf`,
"File validation and build process review").

### 5.1 Step 46 — Final UI/UX Polish + Responsive QA

**Prompt:** Not recoverable — the export opens mid-audit ("Viewed 4 files, ran 2 commands... File
is only 124 lines total..."), before any visible user turn. The instruction that started Step 46
is not present in this export.

**Outcome:** A full audit of Landing, Candidate Setup, Interview Workspace, Evidence, Results, and
shared layout/primitives found the codebase already highly consistent (uniform design tokens,
spacing scale, card patterns, typography hierarchy). Three narrow, genuine bugs were found and
fixed:
- `components/interview/EvidencePanel.tsx` — a session-log row could overflow instead of
  truncating on narrow sidebar widths (missing `min-w-0 flex-1` on a flex child); fixed.
- `components/interview-setup/ResumeInput.tsx` — a long attached filename could visually collide
  with the remove (×) button; fixed with `min-w-0 flex-1` on the filename span and reserved
  padding.
- `components/landing/EvidenceChamberVisual.tsx` — the 5-stage evidence-flow grid expanded to 5
  columns at the viewport `sm` breakpoint, but the card's actual rendered width (after the hero
  splits into two columns at `lg`) left each card only ~90–120px wide; converted to a Tailwind v4
  container query so column count responds to the card's own rendered width.

`npm run lint` and `npm run build` were verified clean before and after. `PlaceholderPage.tsx` was
flagged as apparently unused, deferred to Step 47.

A short follow-up user prompt in the same session, fully recoverable:
```text
Please present the exact files you modified or fixed during the Step 46 audit
```
— answered by re-providing the three files above as downloads.

**Files / Changes:** `frontend/src/components/interview/EvidencePanel.tsx`,
`frontend/src/components/interview-setup/ResumeInput.tsx`,
`frontend/src/components/landing/EvidenceChamberVisual.tsx`

---

### 5.2 Step 47 — Final Frontend Cleanup / Consistency Check

**Prompt (verbatim):**
```text
Now proceed with STEP 47 — Final Frontend Cleanup / Consistency Check.
Do NOT start Step 48 yet.
Use the current project state and the work already completed in Step 46.
Goal:
Perform a focused final cleanup of the entire frontend before documentation.
Please audit the frontend for:
1. Unused/dead components, files, imports, variables, and obvious leftover code.
2. Placeholder/demo code that is no longer used.
3. Naming and folder-structure inconsistencies.
4. Duplicate components or utilities that should not exist.
5. Unused dependencies only if they are clearly safe to identify.
6. Inconsistent UI/component patterns across Landing, Candidate Setup, Interview Workspace,
   Evidence, and Results.
7. Broken or unnecessary routes/references.
8. Obvious console warnings or TypeScript issues.
9. Any remaining frontend-only cleanup that is genuinely necessary.
Important:
- Do NOT redesign the application.
- Do NOT introduce new features.
- Do NOT make speculative changes.
- Do NOT modify working code just for stylistic preference.
- Preserve the existing architecture and design system.
- Only fix issues that are clearly justified.
- Pay particular attention to PlaceholderPage.tsx mentioned in the Step 46 report. Determine
  whether it is truly unused and, if so, remove it safely along with any now-unused
  imports/references.
- Do not touch backend functionality.
After the cleanup:
1. Run the appropriate frontend validation commands from the frontend directory:
   - npm run lint
   - npm run build
2. Verify the existing routes still resolve:
   /
   /interview/setup
   /interview
   /results
   /evidence
3. Report exactly what you changed.
4. Report anything intentionally left unchanged and why.
5. Give a concise Step 47 completion report.
Do not proceed to Step 48 documentation/PROMPTS.md yet.
```

**Outcome:** Confirmed `PlaceholderPage.tsx` was never imported anywhere and deleted it, along
with its now-unused `PlaceholderPageConfig` and `AppRoutePath` types (introduced together back in
Step 39 — Section 3.2). `SectionLabel`, duplicated identically in `LandingPage.tsx` and
`CandidateSetupPage.tsx`, was extracted into a shared `components/SectionLabel.tsx`. Duplicated
date-formatting logic (`formatSubmittedAt` / `formatCapturedAt`) was extracted into
`lib/formatDate.ts`. No unused dependencies, console statements, or TODO/FIXME markers were found;
no hardcoded route strings bypassing the `ROUTES` constant were found. An unused `pendingCount`
field in `resultsAssessment.ts` and several small non-identical `focusLabel`/`focusMeta` helpers
were deliberately left unchanged. `npm run lint` and `npm run build` were verified clean before
and after.

**Files / Changes:**
- Removed: `frontend/src/components/PlaceholderPage.tsx`
- Added: `frontend/src/components/SectionLabel.tsx`, `frontend/src/lib/formatDate.ts`
- Modified: `frontend/src/types/routes.ts`, `frontend/src/pages/LandingPage.tsx`,
  `frontend/src/pages/CandidateSetupPage.tsx`,
  `frontend/src/components/results/SessionSummary.tsx`,
  `frontend/src/components/evidence/EvidenceRecordDetail.tsx`

---

### 5.3 Step 48 — Documentation + PROMPTS.md + Final Frontend Audit

**Prompt (verbatim):**
```text
We are now at STEP 48 — Documentation + PROMPTS.md + Final Frontend Audit.
This is the FINAL frontend step. Do not start any backend work or introduce new features.
Please complete Step 48 comprehensively but keep the scope strictly limited to the current
InterviewX frontend.
Goals:
1. FINAL FRONTEND AUDIT
- Review the current frontend after Steps 40–47.
- Verify that Landing Page, Candidate Setup, Interview Workspace, Evidence System, and
  Results/Assessment are all present and correctly connected.
- Verify routing and navigation between:
  /
  /interview/setup
  /interview
  /results
  /evidence
- Check that the recent Step 46 and Step 47 changes did not introduce regressions.
- Check for obvious broken imports, dead references, inconsistent naming, duplicated logic,
  placeholder/dead components, or unfinished frontend work.
- Do NOT perform speculative refactors. Only fix something if it is clearly necessary.
2. DOCUMENTATION
- Inspect the existing documentation structure and README.md.
- Update/create only the documentation that is genuinely necessary to accurately describe the
  current frontend state.
- Keep documentation concise and project-specific.
- Do not rewrite existing documentation unnecessarily.
3. PROMPTS.md
We previously forgot to maintain PROMPTS.md during development.
For now, create/update the project's PROMPTS.md based ONLY on the AI-development conversation
context that is actually available to you in this Claude conversation and the files in the
repository.
- Document the major AI-assisted development prompts/instructions that can be reliably
  reconstructed from this conversation.
- Organize it chronologically by development phase/step where possible.
- Include the purpose of each prompt and what it resulted in.
- Do NOT invent exact prompts or conversations that you cannot actually verify.
- Clearly mark anything that cannot be reconstructed.
- Mention that additional prompts/conversations from Gemini, Cursor, other Claude accounts, etc.
  will be consolidated later when their conversation history/links are provided.
- Do not fabricate conversation URLs.
- The goal is to establish a useful initial PROMPTS.md rather than pretending it is the complete
  historical record.
4. FINAL CLEANUP
- Check for any obvious documentation inconsistencies.
- Make only safe, necessary frontend/documentation changes.
- Do not modify backend files.
- Do not change the architecture or add new functionality.
5. VALIDATION
After all changes:
- Run npm run lint
- Run npm run build
- Verify the five frontend routes still resolve.
- If possible, perform a lightweight functional/navigation sanity check.
- Fix only issues caused by or discovered during this final step.
6. FINAL REPORT
At the end, provide:
A. What you reviewed
B. What you changed
C. Files added
D. Files modified
E. Files deleted, if any
F. Validation results
G. Any remaining issues/deferred items
H. A clear statement whether the FRONTEND can now be considered COMPLETE.
IMPORTANT:
- This is Step 48 and the final frontend completion step.
- Do NOT proceed to backend implementation.
- Do NOT add unnecessary features.
- Do NOT create speculative improvements.
- Preserve the existing InterviewX design language and architecture.
- If everything is already correct, leave it unchanged and report that clearly.
- Do not just describe changes — actually make the necessary file changes.
```

**Outcome:** This is the session that originally created `PROMPTS.md` (this document is a later
revision of that file). The final audit found zero remaining unused exports, zero duplicate
function names, all `<Link to={...}>` targets valid against `ROUTES`, and no regressions in
`useInterviewSession.ts` / `buildInterviewQueue.ts`; no further code changes were required. The
near-empty root `README.md` (a UTF-16 stub containing only `# IntervueX`) was replaced with a real
project overview; the unmodified Vite-template `frontend/README.md` was replaced with
project-specific docs; the truncated `docs/FRONTEND_DESIGN_SPEC.md` was completed using the exact
values already implemented in `frontend/src/index.css` (verified with a byte-for-byte hex diff).
`npm run lint` and `npm run build` were verified clean; all five routes returned HTTP 200 via
`vite preview`. The session's own conclusion: **"The frontend can be considered COMPLETE for this
phase."**

**Files / Changes:**
- Added: `PROMPTS.md`
- Modified: `README.md`, `frontend/README.md`, `docs/FRONTEND_DESIGN_SPEC.md`

---

## 6. Independent Review

**AI / Tool:** Gemini (`Gemini.pdf`, "Frontend Review: Ready for Backend")

**Purpose:** A final, independent, review-only audit of the completed frontend before starting
backend work.

**Prompt (summarized; the source PDF contains this in full, with twelve detailed audit-area
sub-checks and a required response-format template — reproduced here at that level of detail
rather than character-for-character, given its length):**
```text
You are performing the FINAL independent review of the IntervueX frontend.
IMPORTANT: This is a REVIEW ONLY — do not modify, create, delete, rename, refactor, or rewrite
any files, make code changes, implement fixes, or change the backend. The frontend has already
been completed, committed, and pushed to GitHub; your job is to independently audit it and report
findings only.
PROJECT: IntervueX — an evidence-first interview platform (React + TypeScript + Vite + Tailwind
CSS). The frontend phase has been declared COMPLETE after Steps 40–48. Review the ENTIRE frontend
codebase.
Audit areas: (1) frontend architecture; (2) all five routes (/, /interview/setup, /interview,
/results, /evidence); (3) the end-to-end functional flow (Landing → Candidate Setup → Interview
Workspace → Evidence System → Results/Assessment); (4) Results/Assessment logic; (5) the Evidence
System; (6) responsive UI/UX at mobile/tablet/laptop/desktop; (7) code quality; (8) TypeScript
safety; (9) documentation accuracy; (10) build/lint validation; (11) security/data handling;
(12) design-system consistency.
Review rules: distinguish real issues from optional improvements; do not recommend changes out of
personal preference; do not redesign working components or recommend speculative refactors; do
not treat backend absence as a frontend defect; do not manufacture issues to appear thorough.
Required response format: Overall Verdict (READY FOR BACKEND / READY WITH MINOR ISSUES /
NOT READY); Critical Issues; Major Issues; Minor Issues; Optional Improvements; Route & Navigation
Audit; End-to-End Frontend Flow Audit; Responsive/UI Audit; Code Quality Audit; Documentation
Audit; Build/Lint Status; and a Final Recommendation answering exactly: "Can we stop frontend
development now and begin backend implementation tomorrow without making any additional frontend
changes?"
```

**Outcome — Verdict: READY FOR BACKEND.** No critical, major, or minor issues were found. All five
routes resolved correctly with valid navigation; the full session/evidence/results flow was judged
internally coherent; responsive behavior was confirmed clean at mobile/tablet/laptop/desktop; code
quality, TypeScript strictness, and documentation accuracy were all confirmed; `npm run lint` and
`npm run build` were reported clean. One optional (non-blocking) suggestion was noted: adding mock
loading/network delays to anticipate future backend latency. Final recommendation: **YES** — stop
frontend development and begin backend implementation.

**Files / Changes:** None (review only, by design).

---

---

# Part II — Backend Development (Steps 49 onward)

Frontend development (Part I, Sections 1–6 above) ended with the Gemini review's **READY FOR
BACKEND** verdict. The sections below reconstruct the backend build that followed, from initial
planning through final demo preparation, sourced entirely from the six Claude Chat PDF exports
listed at the top of this document (`Claude-1.pdf` through `Claude-6.pdf` of the backend-history
upload batch). None of these six conversations' `claude.ai/chat/...` links were fetched — PDF
export content only. Where a PDF renders pasted user content as a collapsed "PASTED" preview card
rather than the full text, that is marked explicitly per-entry as unrecoverable, per this
document's existing convention (Sections 4.2–4.6 above).

## 7. Backend Completion Planning

### 7.1 Initial Completion-Plan Request

**AI / Tool:** Claude Chat (`Claude-1.pdf`, "IntervueX project completion plan",
`claude.ai/chat/ee13c2f8-ce03-4fb6-9cc9-c322613d35ac`)

**Purpose:** Kick off backend planning — analyze the repository after the frontend was declared
complete, and produce a completion plan in terms of modules, in as little time as possible.

**Prompt (verbatim):**
```text
Refer the zip file of my project "IntervueX" and help me complete it. The frontend is complete,
the history of how it was done is attached as an word document. Also i have attached the
screenshts of the problem statement, propose a plan how we should proceed to complete this project
in as less time as possible. Give me a plan in terms of modules. Don't spend too much token on
generating unnecessary summaries and all in this chat. PRovide me a good plan. For reference i
have also attached a plan proposed to me by ChatGPT, neglect it if it is not good.
```
(Attachments: `IntervueX_Work.zip`, `IntervueX_History-1.docx`, `IntervueX_History-2.docx`, and
problem-statement screenshots — not separately recoverable as text from this export.)

**Outcome:** Inspected the repo and found the backend folder empty and the frontend fully
self-contained/simulated (no real API calls; static local question bank; Results/Evidence pages
derived entirely from `sessionStorage`). Proposed a 6-module plan (Backend skeleton → Session
state → Interview orchestrator → Completion+feedback → Frontend rewiring → Hardening) on a
Node/Express/TS **+ Anthropic SDK** stack, explicitly collapsing the more elaborate 16–20-module
"ChatGPT plan" (`History-2.docx`) into a single orchestrated LLM loop. **This Anthropic-based plan
was not the one ultimately approved or implemented** — see 7.2.

**Status:** Superseded (planning only).

**Files / Changes:** None.

---

### 7.2 Plan Revision — Drop Anthropic, Add Groq/Mistral Provider Abstraction

**AI / Tool:** Same session, continued.

**Purpose:** Revise the plan before implementation begins: remove the Anthropic SDK (no key
available), add a Groq-primary/Mistral-fallback provider abstraction, and hard-time-box the whole
build to 6 hours.

**Prompt availability:** Original prompt not recoverable from this export — rendered as a
collapsed "PASTED" preview card showing only:
```text
I want to revise the backend plan before we start implementation. IMPORTANT CHANGE — LLM
PROVIDER: Do NOT use the Anthropic SDK. I do not hav…
```

**Outcome:** Restructured the plan into 8 numbered phases — PHASE 1 Backend Foundation, PHASE 2
Data + Session Management, PHASE 3 LLM Provider Integration, PHASE 4 Interview
Orchestration/Adaptive Loop, PHASE 5 Completion + Feedback, PHASE 6 Backend Testing, PHASE 7
Frontend Integration, PHASE 8 End-to-End Testing + Demo Prep — each with explicit files,
acceptance criteria, and an "if behind" fallback cut, totaling an estimated ~6h05m. **This is the
plan subsequently approved and implemented** across Sections 7.3–15 below.

**Status:** Superseded by approval (planning only; approved immediately after, see 7.3).

**Files / Changes:** None.

---

### 7.3 Approval + Phase 1 (Backend Foundation) Execution

**AI / Tool:** Same session, continued.

**Purpose:** Approve the final 8-phase plan and execute Phase 1 (backend skeleton) only.

**Prompt availability:** Original prompt not recoverable from this export — collapsed "PASTED"
preview only:
```text
We have approved the FINAL 6-HOUR BACKEND PLAN. We are now executing ONLY PHASE 1 — BACKEND
FOUNDATION. Do not implement Phase 2 …
```

**Outcome — Status: COMPLETE.** Scaffolded `backend/` from scratch: an Express+TS app split into
`app.ts` (exports the app) and `server.ts` (starts the listener — done specifically so `supertest`
can hit the app without binding a real port), env config reading `PORT`/`CORS_ORIGIN`/`NODE_ENV`/
`GROQ_API_KEY`/`MISTRAL_API_KEY` (latter two unused this phase), and a contract-shaped placeholder
`POST /api/interview` route. `tsconfig.json`'s `moduleResolution` had to be changed from `node` to
`bundler` because the unpinned `npm install typescript` pulled TypeScript 7, which removed the
legacy `node`/`node10` resolution mode.

**Files / Changes:**
- Created: `backend/src/app.ts`, `backend/src/server.ts`, `backend/src/config/env.ts`,
  `backend/src/routes/interview.ts`, `backend/tests/app.test.ts`, `backend/package.json`,
  `backend/tsconfig.json`, `backend/.env.example`, `backend/.gitignore`, `backend/README.md`
- Modified: none outside `backend/`
- Dependencies added: runtime — `express`, `cors`, `dotenv`; dev — `typescript`, `tsx`,
  `@types/node`, `@types/express`, `@types/cors`, `vitest`, `supertest`, `@types/supertest`

**Verification:**
- Typecheck: PASS (0 errors, after the `moduleResolution` fix)
- Tests: 8/8 PASS (health check, valid start, valid turn, missing-`sessionId` rejection,
  missing-both-fields rejection, non-object-candidate rejection, malformed-JSON → 400 without
  crashing, unknown-route 404)
- Build: PASS; live `curl` verification against the compiled `dist/` build also passed
  (`/health` → `200 {"status":"ok"}`)

**Notes / Handoff:** Stopped explicitly after Phase 1 — "Phase 2 not started," per the plan's phase
boundaries.

---

### 7.4 Backend-Folder Isolation Confirmation

**AI / Tool:** Same session, continued.

**Purpose:** Verify only `backend/` was touched, so the user could safely replace just that folder
in their own repo.

**Prompt (verbatim):**
```text
Tell me whether only backend folder was updated, right? ANd nnothing else changed from frontend,
data or docs folder and also the .md files from the root directory?? SO that i will replace only
the backend folder from my own repo and touch nothing else from the zip you gave me
```

**Outcome:** Ran a full `diff` against the original upload; confirmed byte-for-byte identical
outside `backend/` — `frontend/`, `data/curriculum.json`, `data/candidates.json`, `docs/`, root
`README.md`, and root `PROMPTS.md` were all untouched. Flagged two extra scratch files in the
delivered zip (`README_utf8.md`, `History2_full.txt`) as the assistant's own reading artifacts,
not part of the repo, safe to delete.

**Status:** COMPLETE (verification only).

**Files / Changes:** None.

---

### 7.5 Implementation Prompt Pack

**AI / Tool:** Same session, continued.

**Purpose:** Produce a standalone, portable markdown document containing a self-sufficient
copy-paste prompt for every phase (A–H) plus utility prompts, usable in a brand-new AI session
with zero conversation history.

**Prompt availability:** Original prompt not recoverable from this export — collapsed "PASTED"
preview only:
```text
I want you to prepare a COMPLETE, PORTABLE IMPLEMENTATION PROMPT PACK for the IntervueX project
based strictly on the FINAL APPROVED ROA…
```

**Outcome:** Produced a ~1,670-line, 15-section markdown document (usage guide, master
project-context block, architecture decision record; one standalone prompt per Phase A–H; plus
Emergency Recovery, Debugging/Bug-Fix, Code Review, and Final Pre-Submission Audit utility
prompts). No repository code was touched.

**Status:** COMPLETE.

**Files / Changes:** New deliverable, outside the repo: "Intervuex implementation prompt pack"
(delivered as a document, not committed to the codebase).

---

## 8. Backend Phase B — Data + Session Management

**AI / Tool:** Claude Chat (`Claude-2.pdf`, "Phase B backend testing and verification",
`claude.ai/chat/bfaaca56-647f-43fa-a79c-8149e8bed045`)

**Purpose:** Implement Phase B of the approved plan — load `curriculum.json`/`candidates.json`
into memory and add in-memory session management, wired into the Phase A route.

**Prompt availability:** Original prompt not recoverable from this export — collapsed "PASTED"
preview only:
```text
You are implementing PHASE B — DATA + SESSION MANAGEMENT for the IntervueX project. IMPORTANT: I
have uploaded the LATEST ZIP of my curre…
```

**Outcome — Status: COMPLETE** (per the session's own "Phase B Status: PASS"). Added typed
data/session services and wired the route to them; validation logic unchanged from Phase A.

**Files / Changes:**
- Created: `backend/src/types/candidate.ts`, `backend/src/types/curriculum.ts`,
  `backend/src/types/session.ts`, `backend/src/services/dataService.ts`,
  `backend/src/services/sessionService.ts`, `backend/tests/phaseB.test.ts`
- Modified: `backend/src/routes/interview.ts` (wires `POST /api/interview` to session/data
  services; `start` creates-or-retrieves a session and resolves the candidate id against
  `candidates.json`; `turn` requires an existing session — 404 otherwise)
- Unchanged (confirmed): `frontend/`, `data/`, `docs/`, root `README.md`/`PROMPTS.md`,
  `backend/src/app.ts`, `backend/src/server.ts`, `backend/src/config/env.ts`,
  `backend/tests/app.test.ts`, `backend/package.json`, `backend/tsconfig.json`
- Dependencies added: none

**Verification:**
- Typecheck: PASS
- Tests: 16/16 PASS (8 Phase A + 8 Phase B)
- Build: PASS, including a dist-path smoke test confirming data-directory resolution works
  identically for `tsx src/server.ts` (dev) and the compiled build

**Notes / Handoff:** `incrementQuestionsAsked`/`addDayCovered` helpers exist on `sessionService`
but are not yet called — intended for Phase D. The route still returns hardcoded placeholder
reply strings; Phase C replaces those with real LLM calls, not the session/data plumbing.

---

## 9. Backend Phase C — LLM Provider Integration

**AI / Tool:** Same session, continued.

**Purpose:** Implement Phase C — a Groq-primary/Mistral-fallback provider abstraction behind a
single `llmService` entry point.

**Prompt availability:** Original prompt not recoverable from this export — collapsed "PASTED"
preview only:
```text
We are now proceeding to PHASE C — LLM PROVIDER INTEGRATION of the approved IntervueX backend
implementation plan. IMPORTANT CONTEXT: …
```

**Outcome — Status: COMPLETE.** Built a shared OpenAI-compatible HTTP layer (Groq and Mistral are
both OpenAI-compatible chat-completions APIs) with structured-output validation and one retry on
malformed JSON; `llmService` tries Groq first, falls through to Mistral on network error, timeout,
or repeated parse failure; `interviewService` never imports either provider directly.

**Files / Changes:**
- Created: `backend/src/types/llm.ts`, `backend/src/services/llm/errors.ts`,
  `backend/src/services/llm/openaiCompatible.ts`, `backend/src/services/llm/validate.ts`,
  `backend/src/services/llm/prompt.ts`, `backend/src/services/llm/groqProvider.ts`,
  `backend/src/services/llm/mistralProvider.ts`, `backend/src/services/llmService.ts`,
  `backend/tests/llm.test.ts`
- Modified: `backend/src/config/env.ts` (added `groqModel`/`mistralModel`, defaulted),
  `backend/.env.example` (added `GROQ_MODEL`/`MISTRAL_MODEL` placeholders)
- Not modified (explicit decision, not oversight): `backend/src/routes/interview.ts` — wiring
  `llmService` into the route was deferred to Phase D, since building the real interview context
  is orchestration logic
- Dependencies added: none (uses Node 22's built-in global `fetch`)

**Verification:**
- Typecheck: PASS
- Tests: 26/26 PASS (Phase A: 8, Phase B: 8, Phase C: 10)
- Build: PASS
- `grep -r anthropic src/ tests/` → no matches (confirms no Anthropic SDK usage, per 7.2)
- `diff package.json` before/after → unchanged, no new dependencies

**Notes / Handoff:** No real Groq/Mistral network calls were made this phase — tests mock `fetch`
by design. The user separately confirmed 26/26 in their own environment, with two apparent "FAIL"
suites traced to stale compiled `dist/tests/*.js` output also being picked up by Vitest — resolved
in 10 below.

---

## 10. Backend Phase C Hygiene Fix — Vitest Config

**AI / Tool:** Same session, continued.

**Purpose:** Add a `vitest.config.ts` so Vitest stops discovering stale compiled test files under
`dist/`.

**Prompt (verbatim; the transcript UI shows a truncating "Show more" control immediately after
this point, so this may not be the complete original message):**
```text
Yes, implement the small Phase C hygiene fix.
Create backend/vitest.config.ts to explicitly exclude compiled build output from Vitest test discovery.
Use the minimal configuration:
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
});
Do NOT modify any Phase A, Phase B, or Phase C application logic or existing test logic.
After creating the config:
1. Delete the existing backend/dist/ directory so stale compiled test artifacts are gone.
2. Run:
   - npm run typecheck
   - npm test
   - npm run build
3. After the build, run npm test again to prove Vitest still ignores dist/tests/**.
4. Confirm that only the real source tests under backend/tests/ are executed.
5. Expected result: all 26 real tests pass with no failed suites.
6. Do not add unnecessary dependencies.
IMPORTANT DELIVERY RULE:
- Do NOT give me a ZIP.
- Do NOT give me the whole backend.
- Deliver only the newly created/modified file(s) individually in downloadable format.
- In this case, this should normally be only backend/vitest.config.ts.
- Do not provide unnecessary explanations or long summaries. Give only the verification result and the downloadable file.
```

**Outcome — Status: COMPLETE.** Created `vitest.config.ts` exactly as specified; confirmed that
with `dist/` present after build, only the 3 real test files ran and no `dist/tests/**` suites
were discovered.

**Files / Changes:**
- Created: `backend/vitest.config.ts`

**Verification:**
- Typecheck: PASS
- Tests (before build): 3 test files, 26/26 PASS
- Build: PASS
- Tests (after build, `dist/` present): 3 test files, 26/26 PASS, no `dist/tests/**` discovered

---

## 11. Backend Phase D — Interview Orchestration / Adaptive Loop

**AI / Tool:** Claude Chat (`Claude-3.pdf`, "Interview service implementation with context
fields", `claude.ai/chat/d99521e9-10b1-4ad6-b791-e05c6fc0cdbf`)

**Purpose:** Implement Phase D — the core adaptive interview loop: full-context prompt building,
the backend-owned completion rule, and schema validation.

**Prompt availability:** Original prompt not recoverable from this export — collapsed "PASTED"
preview only:
```text
PHASE D — INTERVIEW ORCHESTRATION / ADAPTIVE LOOP We are now implementing Phase D of the approved
IntervueX backend implementation pl…
```

**Outcome — Status: COMPLETE.** Extended the Phase C prompt builder with the new context fields
and explicit interview rules; added a schema file holding the route-facing response contract
(`InterviewServiceResult`) and the backend-owned `computeReadyToConclude` rule (kept deliberately
separate from `services/llm/validate.ts`, which owns LLM-turn-level validation); added
`interviewService.ts` implementing `handleTurn(session, message?)`; updated the route to integrate
the service. One test-tooling issue was hit and fixed along the way — an API-key initialization
timing bug that was blocking mocked `fetch` calls in the new test file.

**Files / Changes:**
- Created: `backend/src/services/interviewService.ts`, `backend/src/schemas/interview.ts`,
  `backend/tests/phaseD.test.ts`
- Modified: `backend/src/services/llm/prompt.ts`, `backend/src/types/llm.ts`,
  `backend/src/routes/interview.ts`
- Deliberate deviations from the literal file list (both explained in the session's own report):
  no separate `interviewPrompt.ts` was created — `services/llm/prompt.ts` (the existing Phase C
  prompt builder) was extended in place rather than forking a second prompt path;
  `interviewService.handleTurn` takes the already-loaded `session` rather than just `sessionId`,
  since the route already performs the 404 lookup for unknown sessions.

**Verification:**
- Typecheck: PASS
- Tests: 33/33 PASS (26 existing + 7 new)
- Build: PASS; re-run after build confirmed `dist/**` still excluded

**Notes / Handoff:** No known issues/blockers reported at the end of Phase D.

---

## 12. Backend Phase E — Completion + Feedback

**AI / Tool:** Claude Chat (`Claude-4.pdf`, "Phase E completion verification and testing",
`claude.ai/chat/2dea5618-5c2b-4c03-aaa0-d137b8d94f81`)

**Purpose:** Implement Phase E — real completion detection (`done: true`) and LLM-generated final
feedback, replacing the Phase D placeholder that always returned `done: false`.

**Prompt availability:** Original prompt not recoverable from this export — collapsed "PASTED"
preview only:
```text
Now implement PHASE E — COMPLETION + FEEDBACK for IntervueX. IMPORTANT CONTEXT: You have just
completed Phase D in this same repositor…
```

This session's implementation happened in two parts and is recorded exactly as it occurred, per
the requirement to preserve interrupted/incomplete work rather than smoothing it over.

### 12.1 First pass — PARTIAL / interrupted

**Outcome — Status: PARTIAL.** The assistant explicitly reported: *"I have not finished — you cut
off my tool access mid-implementation, so this is a status report, not a final one."* At the point
of interruption: `generateFeedback` had been added to the `LLMProvider` interface and implemented
in both `GroqProvider`/`MistralProvider` and `llmService` (same Groq→Mistral fallback pattern as
`generateInterviewTurn`); `interviewService.ts` had `generateFinalFeedback()` (LLM retry once,
then a fully deterministic fallback built only from `candidateModel`/`daysCovered`/
`questionsAsked` — never invents anything) plus a strict re-validation guard; `handleTurn` had been
updated to generate/cache feedback once and replay it on later turns; schema and route had been
updated to carry the optional `feedback` field. `npx tsc --noEmit` passed. The full suite showed
**32/33 passing** — the one failure was in `phaseD.test.ts`, on the exact assertion the Phase D
session had explicitly flagged as "Phase E owns real completion + feedback"
(`expect(finalRes.body.done).toBe(false)`) — the assistant was mid-update of that assertion when
cut off. Explicitly not yet done at this point: finishing that assertion update, adding the
targeted Phase E test file, running `git diff`/`git status` to confirm scope, and producing the
final report.

### 12.2 Continuation — COMPLETE

**Prompt (verbatim):** `Continue`

**Outcome — Status: COMPLETE.** Finished updating the `phaseD.test.ts` assertion (`done: true` +
feedback-shape check); added `backend/tests/phaseE.test.ts` (7 targeted tests); ran the full
suite, typecheck, and build. Found and reverted an unrelated, out-of-scope `package-lock.json`
diff produced by the environment's own `npm install` (no dependency changes were intended).
Confirmed via `git diff`/`git status` that only Phase-E-relevant files changed and that
`frontend/`, `data/`, `docs/`, root `README.md`/`PROMPTS.md` remained untouched; no commit/push
was made.

**Files / Changes (final, combined 12.1 + 12.2):**
- Created: `backend/tests/phaseE.test.ts`
- Modified: `backend/src/types/llm.ts`, `backend/src/types/session.ts`,
  `backend/src/schemas/interview.ts`, `backend/src/services/llm/prompt.ts`,
  `backend/src/services/llm/validate.ts`, `backend/src/services/llm/groqProvider.ts`,
  `backend/src/services/llm/mistralProvider.ts`, `backend/src/services/llmService.ts`,
  `backend/src/services/interviewService.ts`, `backend/src/routes/interview.ts`,
  `backend/tests/llm.test.ts` (fake test provider extended to satisfy the larger `LLMProvider`
  interface, no behavioral change), `backend/tests/phaseD.test.ts` (the one flagged assertion
  updated)
- Untouched (confirmed): `frontend/`, `data/`, `docs/`, root `README.md`/`PROMPTS.md`,
  `computeReadyToConclude`/thresholds, session/data services' core logic
- Dependencies added/removed: none (stray `package-lock.json` diff reverted)

**Verification:**
- Typecheck: PASS
- Tests: 40/40 PASS (33 original + 7 new)
- Build: PASS

**Notes / Handoff:** A follow-up prompt in the same session — *"You completed Phase E
successfully, but forgot to present the files. Please now present the exact CREATED/MODIFIED
Phase E files with their repository paths and final contents, and confirm the final git status. Do
not make any further code changes."* (verbatim) — was answered by presenting all 13
created/modified files read-only, with `git status` re-confirmed showing exactly those 13 paths.

---

### 12.3 Schema-vs-Route File Disambiguation

**AI / Tool:** Same session, continued.

**Purpose:** The user, holding two downloaded files with similar names, asked which belonged in
`schemas/` vs `routes/`.

**Prompt (verbatim):** `which one is supposed to ogo inside schemas folde and routes folder`

**Outcome:** Clarified that the 39-line file (with `InterviewServiceResult`,
`computeReadyToConclude`, `MIN_QUESTIONS_BEFORE_CONCLUDE`) goes in
`backend/src/schemas/interview.ts` (pure types/constants, no Express), and the 93-line file (with
the Express `Router`, `router.post('/', ...)`) goes in `backend/src/routes/interview.ts` (imports
`Router`/`Request`/`Response` from `express`, defines the actual HTTP endpoint).

**Status:** COMPLETE (clarification only).

**Files / Changes:** None.

---

## 13. Backend Phase F — Real LLM Integration & Production Wiring

**AI / Tool:** Same session, continued.

**Purpose:** Transition the Groq→Mistral architecture from mocked/test execution to real provider
usage, under explicit constraints: no new LLM abstraction, no duplicated functionality,
env-vars-only for keys, preserve all existing contracts, and no tests/builds/commits performed by
the assistant — the user would verify manually.

**Prompt (verbatim; the transcript UI shows a truncating "Show more" control after this point):**
```text
PHASE F — REAL LLM INTEGRATION & PRODUCTION WIRING
Continue IntervueX from the completed Phase E implementation. Inspect the existing backend
architecture and implement Phase F without rewriting or duplicating the Phase A–E work.
Goal: transition the existing Groq → Mistral LLM architecture from mocked/test-oriented execution
to real provider usage for IntervueX, while preserving the existing contracts, fallback behavior,
validation, retry logic, interview orchestration, completion logic, and feedback generation.
Requirements:
- Use the existing GroqProvider, MistralProvider, llmService, interviewService, prompt builder and validation layers.
- Do not create a second LLM abstraction or duplicate existing functionality.
- Wire the providers for real API calls using environment variables only.
- Keep API keys completely out of source code and do not hardcode or expose secrets.
- Preserve Groq → Mistral fallback behavior.
- Preserve structured JSON output validation and retry/fallback safeguards.
- Ensure both interview-turn generation and final-feedback generation use the existing LLM architecture.
- Keep the existing Phase A–E behavior and contracts intact.
- Do not modify frontend, data, docs, README.md, or PROMPTS.md.
- Do not introduce unnecessary dependencies.
- Do not perform tests, typechecks, builds, terminal commands, or verification checks; I will perform those manually.
- Do not commit anything.
At the end, provide only:
1. Phase F implementation summary.
2. Exact files created/modified with repository paths.
3. Any environment variables that I need to configure, without asking me to paste or reveal their secret values.
4. Any important manual setup step required before I run the application.
Do not start Phase G.
```

**Outcome — Status: COMPLETE.** Inspection confirmed the Groq↔Mistral real-provider wiring (real
`api.groq.com`/`api.mistral.ai` endpoints via `callChatCompletion`, keys read only from env, no
secrets in source, `.env` already git-ignored) was already fully in place since Phase C and
unchanged through D/E. The one genuine gap for real (non-mocked) network calls was that a
hung/slow request had no bound; closed by adding an `AbortController`-based timeout inside the
existing shared HTTP layer, configurable via one new optional non-secret env var.

**Files / Changes:**
- Created: none
- Modified: `backend/src/config/env.ts` (added optional `llmRequestTimeoutMs`, from
  `LLM_REQUEST_TIMEOUT_MS`, default 20000), `backend/src/services/llm/openaiCompatible.ts` (added
  the `AbortController` timeout around the existing `fetch` call), `backend/.env.example`
  (documented the new variable)
- Inspected, no changes required: `GroqProvider`, `MistralProvider`, `llmService`,
  `interviewService`, `prompt.ts`, `validate.ts`, routes, schemas

**Verification:** None performed by the assistant this phase — explicitly deferred to the user
per the prompt's own instructions.

**Environment variables to configure:** `GROQ_API_KEY` (required, pre-existing since Phase C),
`MISTRAL_API_KEY` (required, pre-existing since Phase C), `GROQ_MODEL`/`MISTRAL_MODEL` (optional
overrides), `LLM_REQUEST_TIMEOUT_MS` (optional, new — bounds provider call hang time, default
20000ms, not a secret).

**Manual setup step:** populate `backend/.env` (copy from `.env.example`) with real
`GROQ_API_KEY`/`MISTRAL_API_KEY`, then restart the backend.

**Notes / Handoff:** A follow-up prompt in the same session — `Present the files.` (verbatim) —
was answered by presenting the 3 modified/created files read-only.

---

## 14. Backend Phase G — Frontend Integration

**AI / Tool:** Claude Chat (`Claude-5.pdf`, "Frontend file structure inspection",
`claude.ai/chat/7f2266e1-2d32-4b94-9db9-abf7a1606a24`)

**Purpose:** Implement Phase G — rewire the frontend from its local/simulated interview flow to
call the real backend built in Phases A–F.

**Prompt availability:** Original prompt not recoverable from this export — collapsed "PASTED"
preview only:
```text
PHASE G — FRONTEND INTEGRATION You are implementing PHASE G — FRONTEND INTEGRATION for the
IntervueX project. Phases A–F are already …
```

**Outcome — Status: COMPLETE.** Inspected the frontend's setup flow, session hook, question bank,
results/evidence pages, and types before making changes. Added a typed API layer and rewired
session persistence, the core interview hook, and results-derivation logic off of the removed
static question queue and onto real backend `done`/`feedback` state.

**Files / Changes:**
- Created: `frontend/src/types/api.ts` (backend response/feedback types),
  `frontend/src/lib/interviewApi.ts` (`startInterviewSession`, `sendInterviewMessage`)
- Modified: `frontend/src/lib/interviewSession.ts` (persists `sessionId`, current question, and
  final feedback; resets them on new Candidate Setup submission; adds
  `buildCandidateInputPayload`), `frontend/src/hooks/useInterviewSession.ts` (drives the real
  backend instead of the static queue/timers), `frontend/src/pages/InterviewWorkspacePage.tsx`
  (adds start-loading/start-error states, uses backend-derived `totalQuestions`),
  `frontend/src/lib/resultsAssessment.ts` (completion now comes from backend `done`, not the
  removed static queue), `frontend/src/components/results/EvidenceCoverageList.tsx` (generalized
  to render real feedback text — strengths/gaps/next — instead of only focus-area badges),
  `frontend/src/components/results/AssessmentOverview.tsx` (shows backend `feedback.summary` when
  available), `frontend/src/pages/ResultsPage.tsx` (sources strengths/gaps/next/summary from real
  backend feedback)

**Verification:** Not explicitly reported with pass/fail counts in this export; the session
proceeded directly from implementation into file delivery.

**Notes / Handoff:** `data/interviewQuestions.ts` and `lib/buildInterviewQueue.ts` are now unused
but were deliberately left in place rather than deleted, per instructions.

---

## 15. Backend Phase H — Final Polish + Demo Preparation

Two separate Claude Chat sessions both began from what appears to be an identical Phase H kickoff
prompt, around the same time. Both are recorded here rather than silently merged into one entry,
since the source material does not establish which (if either) supersedes the other — see the
Notes below.

**Prompt availability (shared by both sessions below):** Original prompt not recoverable
verbatim in either export — both render it as a collapsed "PASTED" preview showing only:
```text
You are implementing PHASE H — FINAL POLISH + DEMO PREPARATION for the IntervueX project. Phases
A–G are complete. This is the FINAL implem…
```

### 15.1 Session 1 (`Claude-5.pdf`, same chat as Phase G, continued —
`claude.ai/chat/7f2266e1-2d32-4b94-9db9-abf7a1606a24`)

**Outcome — Status: PARTIAL / brief.** Audited component integration and validated the Phase G
type definitions; reviewed `PublicLayout`/`WorkspaceLayout`/`CompetencyHypothesis` and confirmed
no type errors from the Phase G changes; synthesized curriculum/candidate-profile specifics; wrote
a demo-notes file. The captured transcript ends immediately after "Done" — no explicit test/build
verification results or final structured report are visible in this export.

**Files / Changes:** A new demo-day guidance document (exact filename/path not stated in this
export).

### 15.2 Session 2 (`Claude-6.pdf`, "Frontend integration layer P0 bug review",
`claude.ai/chat/91214b52-6932-4e57-b2aa-4c23e1b223b2`)

**Outcome — Status: COMPLETE.** A thorough end-to-end review looking specifically for P0 issues:
the frontend integration layer (`interviewApi.ts`, `useInterviewSession.ts`),
`CandidateSetupPage`/`candidates.json`, `ResultsPage`'s feedback reading, env config and CORS,
`.env` key presence (checked for presence only, not printed), the LLM provider files
(`groqProvider.ts`/`mistralProvider.ts`/`openaiCompatible.ts`/`prompt.ts`/`validate.ts`),
`App.tsx` routing, and the Candidate Setup question-count-vs-completion-threshold relationship.
Conclusion: **no P0 issue was found that blocks the intended demo flow; no code was changed this
session.** One demo nuance (not a bug) was flagged: the Candidate Setup form doesn't collect a
candidate ID, so the backend falls back to the raw submitted candidate object rather than
resolving against `data/candidates.json` — documented as intentional, non-blocking behavior.

**Files / Changes:** None (review-only). Deliverable: `backend/DEMO_NOTES.md`.

**Notes / Handoff:** Session 2's `backend/DEMO_NOTES.md` deliverable path matches what Session 1
was also producing. These two sessions likely represent either two independent passes at the same
Phase H task, or one superseding the other — **this cannot be resolved from the available exports
and is flagged here as an unresolved source conflict** rather than silently picking one over the
other.

---

## 16. Sources Not Reviewed

- **ChatGPT:** Intentionally not reviewed for this task. No ChatGPT export was provided, and per
  the task instructions its share link was not accessed and no ChatGPT prompt is claimed or
  reconstructed anywhere in this document. `IntervueX_Progress.md` documents that ChatGPT's role
  in the multi-AI workflow was architecture, planning, and technical decisions/debugging, but no
  original ChatGPT prompt is recoverable or asserted here. This remains true after this revision —
  no ChatGPT material was supplied or reviewed this pass either.
- **The `claude.ai/chat/...` share links for all six backend-history conversations** (`Claude-1.pdf`
  through `Claude-6.pdf` of this revision's upload batch, Sections 7–15 above): supplied but not
  fetched. Only their PDF export content was used as evidence.

---

## How to extend this file

The largest remaining gaps are: Steps 1–29 (planning/architecture, Section 1), the four
Claude-Chat prompts that were only captured as truncated previews (Sections 4.2–4.4), the
unrecoverable verdict of the pre-Step-43 readiness check (Section 4.5), the unrecoverable
initiating prompts for the Evidence/Results build (Section 4.6) and for Step 46 (Section 5.1), and
the ChatGPT conversation (Section 16) — all unchanged from the prior revision. **Newly added in
this revision:** nine backend prompts were only recoverable as truncated "PASTED" previews
(Sections 7.2, 7.3, 7.5, 8, 9, 11, 12, 14, and the shared Phase H kickoff in 15), and the Phase H
duplication between Sections 15.1 and 15.2 remains an open, unresolved conflict. If full
conversation exports covering any of these become available — including the six
`claude.ai/chat/...` backend links noted in Section 16 — add them as new dated entries in the
appropriate section above, following the same format: verbatim prompt (or an explicit note that
only a partial/paraphrased version is available), outcome, status (COMPLETE/PARTIAL/BLOCKED/
REVIEW-ONLY), files touched, and verification results. Do not backfill prompts from memory or
inference.