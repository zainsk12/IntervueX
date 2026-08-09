# IntervueX — Development Progress

> **Purpose:** Track the actual development progress, major decisions, completed work, validation, and the exact point where development should resume.
>
> **Roadmap:** `docs/IntervueX_Roadmap.md`
>
> **Technical Specification:** `docs/technical-spec.md`
>
> **Frontend Design:** `docs/FRONTEND_DESIGN_SPEC.md`

---

# 1. Project Overview

**Project:** IntervueX  
**Hackathon:** ViCodathon — AB Talks  
**Problem Statement:** Problem Statement 2 — The Interview Agent

### Product Philosophy

> **Don't interview the resume. Interview the evidence.**

IntervueX is an adaptive AI technical interviewer. Its core differentiator is the **Dynamic Candidate Model**, where the candidate's initial profile is treated as a hypothesis and updated as interview evidence is collected.

```text
Candidate Profile
      ↓
Initial Candidate Model
      ↓
Question → Answer
      ↓
AI Evaluation
      ↓
Evidence Extraction
      ↓
Candidate Model Update
      ↓
Confidence / Uncertainty
      ↓
Evidence Gap
      ↓
Adaptive Follow-up
      ↓
Final Assessment
```

The central product story is:

> **The interview itself changes what IntervueX believes about the candidate.**

---

# 2. Core Requirements

The project is designed around:

- Conversational technical interviewing
- Minimum 8 questions
- Coverage of at least 4 curriculum days/topics
- Follow-up questions
- Context-aware and adaptive questioning
- Evidence-based assessment
- Structured feedback
- Required HTTP/API endpoint
- AI-driven interview behavior

The interview should gather evidence, update the candidate model, identify gaps, and adapt subsequent questions.

---

# 3. Development Progress

```text
Steps 1–14
    ↓
Planning & Product Definition
    ↓
Steps 15–29
    ↓
Implementation Roadmap
    ↓
Steps 30–39
    ↓
Intermediate Development
    ↓
Steps 40–45
    ↓
Frontend Implementation
    ↓
Step 46
    ↓
Frontend Audit
    ↓
Step 47
    ↓
Cleanup & Refactoring
    ↓
Step 48
    ↓
Documentation & Final QA
    ↓
Gemini Independent Review
    ↓
Frontend COMPLETE / FROZEN
    ↓
Backend NEXT
```

> The original prompt/details for every intermediate step are not fully available. Steps 40–45 are therefore recorded only at the level supported by the surviving project documentation.

---

# 4. STEPS 1–14 — PLANNING

**Status: COMPLETE**

The planning phase established:

- Problem Statement and product direction
- Dynamic Candidate Model
- Adaptive interview mechanism
- Evidence-based assessment
- UI/UX direction
- Technical architecture
- Multi-AI development workflow
- Implementation roadmap
- Demo/submission strategy

---

# 5. STEPS 15–29 — IMPLEMENTATION ROADMAP

The planned implementation covered:

### Candidate & Intelligence
- Candidate profile integration
- Curriculum integration
- Initial Candidate Model
- Dynamic Candidate Model
- Confidence, uncertainty and contradictions

### Interview Engine
- Interview planner
- Question generator
- Answer evaluator
- Adaptive follow-ups
- Interview session management

### AI
- Multi-LLM experimentation
- Evaluation/reconciliation
- Fallback strategy

### Frontend
- Landing
- Candidate Setup
- Interview Workspace
- Evidence
- Results

### Testing & Submission
- Edge-case testing
- UI/UX polish
- Documentation
- Deployment
- End-to-end demo preparation

---

# 6. MULTI-AI DEVELOPMENT WORKFLOW

The project uses clearly separated AI responsibilities:

- **ChatGPT:** Architecture, planning, technical decisions, debugging, review and coordination
- **Claude Code:** Deep coding, multi-file implementation, refactoring and testing
- **Cursor:** Interactive development and integration
- **Gemini:** Independent review and validation
- **GitHub:** Shared source of truth

Development follows:

```text
Plan → Implement → Test → Review → Adjust → Next Step
```

Avoid speculative refactoring and unnecessary complexity.

---

# 7. FRONTEND IMPLEMENTATION

### Stack

- React
- TypeScript
- Vite
- Tailwind CSS

### Final Routes

```text
/                   → Landing Page
/interview/setup    → Candidate Setup
/interview          → Interview Workspace
/evidence           → Evidence System
/results            → Results / Assessment
```

### Important Frontend Modules

```text
frontend/src/hooks/useInterviewSession.ts
frontend/src/lib/interviewSession.ts
frontend/src/lib/buildInterviewQueue.ts
frontend/src/lib/resultsAssessment.ts
frontend/src/lib/formatDate.ts
```

The frontend includes session persistence, question queue behavior, evidence representation, results synthesis, responsive layouts and the established design system.

---

# 8. STEPS 40–45 — FRONTEND IMPLEMENTATION

**Status: COMPLETE**

The frontend implementation phase established:

- Landing Page
- Candidate Setup
- Interview Workspace
- Evidence System
- Results / Assessment
- Session persistence
- Question queue
- Evidence representation
- Results synthesis
- Responsive UI
- Design system

The exact original prompts for these steps could not be fully reconstructed and are intentionally not fabricated.

---

# 9. STEP 46 — FRONTEND AUDIT

**Status: COMPLETE**

A detailed audit checked:

- Dead files/components
- Unused exports/dependencies
- Duplicate code/components
- Naming/folder consistency
- TODO/FIXME/debug code
- Routes
- TypeScript
- Build/lint

### Main findings

- `PlaceholderPage.tsx` was unused
- `PlaceholderPageConfig` and `AppRoutePath` were unused
- `SectionLabel` was duplicated
- Date-formatting logic was duplicated
- No unused dependencies were found
- No problematic console/TODO/FIXME code was found

---

# 10. STEP 47 — CLEANUP & REFACTORING

**Status: COMPLETE**

### Removed

```text
frontend/src/components/PlaceholderPage.tsx
```

### Added

```text
frontend/src/components/SectionLabel.tsx
frontend/src/lib/formatDate.ts
```

### Modified

```text
frontend/src/types/routes.ts
frontend/src/pages/LandingPage.tsx
frontend/src/pages/CandidateSetupPage.tsx
frontend/src/components/results/SessionSummary.tsx
frontend/src/components/evidence/EvidenceRecordDetail.tsx
```

The duplicate components/logic were consolidated without changing working business behavior.

### Validation

```text
npm run lint  → Clean
npm run build → Clean
TypeScript    → Passed
```

All five routes continued to resolve correctly.

---

# 11. STEP 48 — DOCUMENTATION & FINAL QA

**Status: COMPLETE**

Reviewed:

- Entire `frontend/src`
- Routing
- Interview session logic
- Question queue
- Results logic
- README files
- `PROMPTS.md`
- Design specification
- Technical specification
- JSON/data files

### Documentation Updated

- `README.md`
- `frontend/README.md`
- `docs/FRONTEND_DESIGN_SPEC.md`
- `PROMPTS.md`

The frontend design specification was completed using the already implemented CSS values. `PROMPTS.md` records the limitation around reconstructing the original Steps 40–45 prompts.

### Final Validation

```text
npm run lint  → Clean
npm run build → Clean
Production preview → Passed
All 5 routes → HTTP 200
Deep-link navigation → Checked
```

---

# 12. GIT BASELINE

After Step 48:

```bash
git add .
git commit -m "Complete frontend implementation and final QA"
git push origin main
git status
```

Commit:

```text
70c1357
Complete frontend implementation and final QA
```

Result:

```text
15 files changed
329 insertions(+)
167 deletions(-)
Working tree clean
Branch up to date with origin/main
```

This commit represents the complete frontend baseline.

---

# 13. GEMINI INDEPENDENT REVIEW

**Verdict: READY FOR BACKEND**

Gemini independently reviewed:

- All five routes
- End-to-end frontend flow
- Session/state handling
- Question queue
- Evidence system
- Results system
- Responsive behavior
- Code quality
- Documentation
- Build/lint

Result:

```text
Critical Issues: None
Major Issues:    None
Minor Issues:    None
```

One optional suggestion was mock loading/network delays. This is not required now and can be considered during backend integration.

---

# 14. CURRENT PROJECT STATUS

```text
Planning                    COMPLETE
Frontend Implementation     COMPLETE
Frontend Cleanup            COMPLETE
Documentation               COMPLETE
Frontend Validation         PASSED
Claude Audit                PASSED
Gemini Review               PASSED
Git Baseline                COMPLETE

Backend Phase A              COMPLETE
Backend Phase B              COMPLETE
Backend Phase C              COMPLETE
Backend Phase D              IN PROGRESS

Frontend                    FROZEN
Backend Foundation           COMPLETE
Data + Session Management    COMPLETE
LLM Provider Abstraction     COMPLETE
Interview Orchestration      IN PROGRESS
Real API Smoke Test          PENDING
Frontend Integration         PENDING
End-to-End Integration      PENDING
Deployment                  PENDING
Final Demo                  PENDING
Final Submission            PENDING
```

---

# 15. BACKEND IMPLEMENTATION — PHASES A–C

The backend is now being implemented incrementally according to the approved backend plan. The architecture is intentionally backend-owned and provider-abstracted:

```text
HTTP Route
    ↓
Interview Service
    ↓
Session + Data Services
    ↓
LLM Service
    ↓
Groq (Primary)
    ↓ fallback
Mistral (Secondary)
```

The backend uses **Node.js + TypeScript + Express**, with the existing JSON datasets as the source of candidate/curriculum data and in-memory session storage for the current implementation.

---

## Phase A — Backend Foundation

**Status: COMPLETE**

### Implemented

Created the backend foundation under `backend/`:

```text
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/env.ts
│   └── routes/interview.ts
├── tests/app.test.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### Responsibilities

- Express application setup
- CORS
- JSON parsing
- Environment configuration
- `GET /health`
- `POST /api/interview` contract-shaped placeholder
- 404 handling
- malformed JSON/error handling
- TypeScript/Vitest test setup

### Validation

```text
TypeScript compilation       PASS
Phase A tests                8/8 PASS
/health                      PASS
/api/interview validation   PASS
Malformed JSON handling      PASS
Build                        PASS
```

A TypeScript 7/module-resolution compatibility issue was resolved with the appropriate bundler configuration.

---

## Phase B — Data + Session Management

**Status: COMPLETE**

### Created

```text
backend/src/types/candidate.ts
backend/src/types/curriculum.ts
backend/src/types/session.ts
backend/src/services/dataService.ts
backend/src/services/sessionService.ts
backend/tests/phaseB.test.ts
```

### Implemented

- Loads `data/curriculum.json` and `data/candidates.json` into memory at startup.
- Candidate lookup by ID/member ID.
- Curriculum day/module lookup.
- Candidate/curriculum listing helpers.
- In-memory `Map<sessionId, InterviewSession>`.
- Session creation and retrieval.
- Conversation history persistence.
- Questions-asked tracking.
- Days-covered tracking.
- Candidate model storage.
- Session status.
- Helper mutators reserved for later orchestration.

The existing `POST /api/interview` route was updated to use the Phase B data/session services while preserving Phase A validation behavior.

### Validation

```text
Phase A + Phase B tests     16/16 PASS
TypeScript                  PASS
Build                       PASS
Live API smoke verification PASS
```

---

## Phase C — LLM Provider Integration

**Status: COMPLETE**

### Created

```text
backend/src/types/llm.ts
backend/src/services/llm/errors.ts
backend/src/services/llm/openaiCompatible.ts
backend/src/services/llm/validate.ts
backend/src/services/llm/prompt.ts
backend/src/services/llm/groqProvider.ts
backend/src/services/llm/mistralProvider.ts
backend/src/services/llm/llmService.ts
backend/tests/llm.test.ts
```

### Architecture

```text
Interview Service
      ↓
   llmService
      ↓
  ┌───────────┐
  │   Groq    │ ← primary
  └─────┬─────┘
        │ failure
        ↓
  ┌───────────┐
  │  Mistral  │ ← fallback
  └───────────┘
```

### Important decisions

- No Anthropic SDK.
- No direct provider calls from routes.
- Groq is the primary provider.
- Mistral is the fallback provider.
- `llmService` is the single LLM entry point.
- Providers use OpenAI-compatible chat-completions HTTP calls.
- Provider output is validated into the structured `InterviewTurn`.
- Tests mock provider/fetch behavior; real API keys are not required for automated tests.
- Real API smoke testing is deliberately deferred until after the orchestration layer is complete.

### Configuration

`backend/src/config/env.ts` contains provider/model configuration, and `.env.example` contains placeholders for provider model variables.

Real API keys must remain local in `backend/.env` and must never be committed to Git.

### Validation

```text
TypeScript                     PASS
Phase A + B + C tests          26/26 PASS
Build                          PASS
Anthropic dependency check     PASS — none present
New npm dependency check       PASS — none required
```

### Vitest hygiene fix

After the build, Vitest initially discovered stale compiled test files under `dist/tests/`. This was a test-discovery/build-artifact issue rather than a Phase C application failure.

Permanent fix:

```text
backend/vitest.config.ts
```

with `dist/**` excluded from Vitest discovery.

Final verification after the fix:

```text
Typecheck                     PASS
Tests before build            26/26 PASS
Build                         PASS
Tests after build             26/26 PASS
dist/tests/** discovered      NO
```

---

# 16. PHASE D — INTERVIEW ORCHESTRATION / ADAPTIVE LOOP

**Status: IN PROGRESS**

Phase D is the current implementation phase.

### Objective

Implement the backend-owned interview orchestration loop:

```text
User Answer
    ↓
Interview Service
    ↓
Build Interview Context
    ↓
llmService
    ↓
Structured InterviewTurn
    ↓
Evidence / Candidate Model Update
    ↓
Question + Conversation State
    ↓
Adaptive Next Turn
```

### Core requirements

Phase D must implement:

- `interviewService.handleTurn(sessionId, message?)`
- Interview prompt/context construction
- Candidate + curriculum context
- Conversation history context
- Candidate model context
- Adaptive questioning
- Evidence extraction/update
- `questionsAsked` tracking
- `daysCovered` tracking
- Backend-owned completion readiness
- Structured LLM response validation
- Safe fallback on malformed LLM output
- Session persistence
- Route integration through the existing architecture

### Backend completion rule

The backend — not the LLM — determines when the interview is ready to conclude:

```text
readyToConclude =
    questionsAsked >= 8
    &&
    daysCovered.size >= 4
```

Until this condition is satisfied, the interview continues.

Phase D does **not** implement final feedback generation. That belongs to Phase E.

### Adaptive behavior

Later questions should visibly use evidence from earlier answers.

The implementation should support:

- clarifying weak/short answers
- deeper follow-ups for strong answers
- avoiding unnecessary repetition
- referencing earlier answers
- using curriculum/candidate context
- updating lightweight evidence/signals

The LLM provides evidence/signals; the backend owns state and completion.

### Phase D testing

The Phase D tests must verify:

- new session handling
- existing session continuation
- user-message persistence
- assistant-response persistence
- `questionsAsked` increment
- `daysCovered` update
- candidate-model/evidence update
- previous conversation included in later context
- deterministic completion readiness
- no early completion
- completion readiness after both thresholds
- malformed LLM output handling
- provider failure handling
- all existing Phase A/B/C tests remain passing

Real Groq/Mistral calls are **not** required for automated Phase D tests.

---

# 17. API KEY / REAL PROVIDER PLAN

**Status: PENDING — intentionally deferred**

Real Groq and Mistral API keys are **not required during Phase D implementation/testing**.

Existing Groq and Mistral keys previously used for another project can be reused for IntervueX if desired; generating new keys is not inherently necessary.

Planned sequence:

```text
Phase D implementation
        ↓
Phase D tests/build PASS
        ↓
Commit Phase D
        ↓
Add real keys to local backend/.env
        ↓
Real Groq smoke test
        ↓
Real Mistral fallback smoke test
        ↓
Continue integration
```

Rules:

- Never hardcode API keys.
- Never commit `.env`.
- Never paste API keys into chat.
- Automated tests should continue using mocks.
- Real API smoke testing should be a controlled separate step.

---

# 18. GIT CHECKPOINTS

Completed frontend checkpoint:

```text
70c1357
Complete frontend implementation and final QA
```

Backend checkpoint policy:

```text
Phase A complete
      ↓
Phase B complete
      ↓
Phase C complete
      ↓
Phase D complete
      ↓
Commit/push checkpoint
```

The current working tree should be committed at the end of Phase D after local verification.

Recommended commands:

```bash
git status
git diff
git add backend
git commit -m "Complete backend phases A-D"
git push origin main
```

Review changes before committing and avoid committing unrelated files.

---

# 19. EXACT RESUME POINT

> **Frontend is complete and frozen. Backend Phases A–C are implemented and verified. Phase D — Interview Orchestration / Adaptive Loop — is currently in progress.**

### Current next action

```text
Finish Phase D
    ↓
Run typecheck
    ↓
Run complete test suite
    ↓
Run build
    ↓
Run tests again after build
    ↓
Review modified/new files
    ↓
Commit + push Phase D
    ↓
Add real Groq/Mistral keys locally
    ↓
Run real provider smoke tests
    ↓
Proceed to Phase E — Completion + Feedback
```

### Important constraints when resuming

- Frontend is **FROZEN** unless backend integration exposes a real issue.
- Do not redesign Phases A–C.
- Keep `llmService` as the single LLM entry point.
- Groq remains primary; Mistral remains fallback.
- Do not introduce Anthropic.
- Do not use real API keys in automated tests.
- Backend owns session state and completion logic.
- Phase E feedback generation must not be pulled forward into Phase D.
- Avoid speculative refactoring and unnecessary dependencies.

### Important Project Files

```text
README.md
PROMPTS.md
docs/IntervueX_Roadmap.md
docs/technical-spec.md
docs/FRONTEND_DESIGN_SPEC.md

backend/src/app.ts
backend/src/server.ts
backend/src/config/env.ts
backend/src/routes/interview.ts
backend/src/services/dataService.ts
backend/src/services/sessionService.ts
backend/src/services/llm/llmService.ts
backend/src/services/llm/groqProvider.ts
backend/src/services/llm/mistralProvider.ts
backend/src/services/llm/prompt.ts
backend/src/types/llm.ts
backend/src/types/session.ts
backend/tests/app.test.ts
backend/tests/phaseB.test.ts
backend/tests/llm.test.ts
backend/vitest.config.ts

frontend/src/types/interview.ts
frontend/src/types/results.ts
frontend/src/lib/interviewSession.ts
frontend/src/lib/buildInterviewQueue.ts
frontend/src/lib/resultsAssessment.ts
frontend/src/App.tsx
frontend/src/data/routes.ts
```

The backend must continue to preserve the core philosophy:

> **Don't interview the resume. Interview the evidence.**
