# IntervueX --- Development Roadmap

## 1. Project Vision

### Project Name

**IntervueX**

### Tagline

> **Don't interview the resume. Interview the evidence.**

### Product Vision

IntervueX is an adaptive AI technical interviewer designed to conduct
realistic, multi-turn technical interviews based on:

-   Candidate profile
-   Learning journey
-   Curriculum progress
-   Candidate responses
-   Evidence demonstrated during the interview
-   Confidence
-   Uncertainty
-   Contradictions
-   Competency assessments

The system should continuously update its understanding of the candidate
throughout the interview instead of treating the candidate profile as
absolute truth.

The final product should feel like an intelligent technical interviewer,
not a generic chatbot or a static question-answer system.

------------------------------------------------------------------------

## 2. Core Product Principle

IntervueX must follow an evidence-driven adaptive loop:

``` text
Candidate Profile
        ↓
Initial Candidate Hypothesis
        ↓
Interview Objective
        ↓
Question
        ↓
Candidate Answer
        ↓
AI Evaluation
        ↓
Evidence Extraction
        ↓
Dynamic Candidate Model Update
        ↓
Confidence / Uncertainty Update
        ↓
Identify Evidence Gap
        ↓
Adaptive Follow-up
        ↓
New Evidence
        ↓
Updated Candidate Model
        ↓
Repeat
        ↓
Evidence-Based Final Assessment
```

The interview itself should change what IntervueX believes about the
candidate.

A candidate's supplied profile is an **initial hypothesis**, not
verified truth.

------------------------------------------------------------------------

# 3. Hackathon Requirements

The implementation must satisfy the core requirements of the Interview
Agent challenge:

-   Conduct a conversational technical interview.
-   Ask a minimum of **8 questions**.
-   Cover at least **4 different curriculum days/topics**.
-   Generate follow-up questions based on previous responses.
-   Maintain conversation context throughout the interview.
-   Adapt questions according to candidate performance.
-   Produce structured feedback at the end.
-   Produce an evidence-based assessment.
-   Expose the required HTTP endpoint defined in the technical
    specification.

The backend must enforce the important completion conditions itself:

``` text
questionsAsked >= 8
AND
curriculumDaysCovered >= 4
```

The LLM must not be the authority for these pass/fail conditions.

------------------------------------------------------------------------

# 4. Architecture Strategy --- Conceptual vs Hackathon Implementation

The original product architecture remains conceptually important:

``` text
Candidate / Curriculum Data
        ↓
Candidate Understanding
        ↓
Initial Candidate Model
        ↓
Interview Planning
        ↓
Question Generation
        ↓
Candidate Response
        ↓
Answer Evaluation
        ↓
Evidence Extraction
        ↓
Dynamic Candidate Model
        ↓
Adaptive Interview
        ↓
Interview Completion
        ↓
Final Assessment
```

However, the hackathon implementation will **not** implement every
conceptual responsibility as an independent service.

With approximately six hours remaining for implementation, a large
multi-module architecture would create unnecessary plumbing and increase
the risk of not having a working end-to-end product.

### Practical implementation principle

**Keep the intelligence conceptually rich but the codebase operationally
compact.**

Related responsibilities should be combined into a small number of
backend modules.

The goal is not to maximize the number of files or services.

The goal is:

> Can a judge select a candidate, conduct a real adaptive AI interview,
> see follow-up behavior based on answers, complete at least 8 questions
> across 4 curriculum days, and receive meaningful structured feedback?

------------------------------------------------------------------------

# 5. Final Hackathon Backend Architecture

The approved practical architecture is:

``` text
backend/
├── src/
│   ├── server.ts
│   ├── config/
│   │   └── env.ts
│   ├── routes/
│   │   └── interview.ts
│   ├── services/
│   │   ├── interviewService.ts
│   │   ├── sessionService.ts
│   │   ├── llmService.ts
│   │   └── dataService.ts
│   ├── prompts/
│   │   └── interviewPrompt.ts
│   ├── schemas/
│   │   └── interview.ts
│   ├── types/
│   │   ├── candidate.ts
│   │   ├── curriculum.ts
│   │   └── interview.ts
│   └── data/
│       └── loader.ts
├── tests/
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

This structure is a guide rather than a requirement to create
unnecessary abstractions.

------------------------------------------------------------------------

# 6. LLM Strategy --- Final Decision

## 6.1 Anthropic SDK --- Removed

**Anthropic SDK will NOT be used.**

The previous plan was based around Anthropic, but this has been
intentionally changed.

Do not add:

-   Anthropic SDK
-   Anthropic API keys
-   Anthropic-specific provider logic
-   Anthropic-specific architecture

------------------------------------------------------------------------

## 6.2 Local LLMs --- Not Used

The project will **not** rely on local model inference.

The following are intentionally excluded:

-   Ollama
-   llama.cpp
-   Local Llama models
-   Local Mistral models
-   Any hardware-dependent local inference

The development machine is not suitable for reliably running large local
models, so cloud-hosted inference is the practical choice.

------------------------------------------------------------------------

## 6.3 Cloud LLM Providers

The approved providers are:

### Primary --- Groq

Groq is the primary LLM provider because:

-   It is cloud hosted.
-   It is fast and suitable for interactive interviews.
-   It has already been used during project development.
-   It provides access to capable open models.
-   It is appropriate for a time-constrained hackathon demo.

### Secondary / Fallback --- Mistral

Mistral is the secondary provider because:

-   It has already been used during project development.
-   It provides another cloud-hosted model option.
-   It can act as a fallback if practical within the remaining time.

### Provider abstraction

The interview engine must not directly depend on either provider.

Conceptually:

``` text
Interview Service
       ↓
LLM Service / Provider Interface
       ↓
 ┌───────────────┐
 │               │
Groq           Mistral
Primary        Fallback
```

A minimal provider abstraction is sufficient.

Do not over-engineer provider orchestration.

------------------------------------------------------------------------

# 7. Backend Intelligence Model

The backend should maintain a compact in-memory interview session.

A session conceptually contains:

``` text
InterviewSession
├── sessionId
├── candidate
├── conversation
├── questionsAsked
├── daysCovered
├── currentQuestion
├── candidateModel
├── evidence
└── status
```

### Lightweight Candidate Model

The Dynamic Candidate Model does not require a separate database or
service.

It should track useful information such as:

``` text
Topic / Competency
├── assessment
├── confidence
└── evidence
```

Example:

``` json
{
  "topic": "Vector Search",
  "assessment": "moderate",
  "confidence": 0.68,
  "evidence": "Candidate explained cosine similarity but could not explain indexing trade-offs."
}
```

The model should evolve as the candidate answers questions.

------------------------------------------------------------------------

# 8. Evidence-Driven Adaptive Interview

The interview must not behave like a predetermined question list.

Avoid:

``` text
Question 1
Question 2
Question 3
Question 4
Question 5
...
```

Instead:

``` text
Question
   ↓
Candidate Answer
   ↓
Evaluate
   ↓
Extract Evidence
   ↓
Update Candidate Model
   ↓
Identify Evidence Gap
   ↓
Generate Next Question
```

Example:

``` text
Q1: Explain vector search.

        ↓

Candidate gives weak explanation.

        ↓

Evidence:
Vector search fundamentals are uncertain.

        ↓

Candidate confidence decreases.

        ↓

Q2:
Targeted follow-up on similarity/search fundamentals.
```

If the candidate subsequently demonstrates strong understanding:

``` text
Evidence improves
        ↓
Confidence increases
        ↓
Difficulty increases
```

This adaptive behavior is one of the most important parts of the demo.

------------------------------------------------------------------------

# 9. Official API Contract

The primary external endpoint remains:

``` http
POST /api/interview
```

### First request

``` json
{
  "sessionId": "abc-123",
  "candidate": { }
}
```

### Subsequent request

``` json
{
  "sessionId": "abc-123",
  "message": "..."
}
```

### Normal response

``` json
{
  "reply": "...",
  "done": false
}
```

### Final response

``` json
{
  "reply": "...",
  "done": true,
  "feedback": {
    "summary": "...",
    "strengths": [],
    "gaps": [],
    "next": []
  }
}
```

The API contract must remain aligned with `docs/technical-spec.md`.

Do not invent a separate frontend-specific contract.

------------------------------------------------------------------------

# 10. Six-Hour Hackathon Implementation Plan

The remaining implementation is time-boxed.

The following plan is the **approved execution roadmap for today's
backend work and final integration**.

## Priority Levels

### P0 --- Must Have

These features are required for a successful demo:

-   Backend runs.
-   Groq LLM works.
-   `/api/interview` works.
-   Session state works.
-   Conversation history works.
-   At least 8 questions.
-   At least 4 curriculum days.
-   Adaptive follow-up questions.
-   Final structured feedback.
-   Frontend can conduct a real interview.

### P1 --- Should Have

-   Mistral fallback.
-   Lightweight evidence tracking.
-   Lightweight Dynamic Candidate Model.
-   Stronger validation.
-   Useful logging.
-   Robust error handling.

### P2 --- Nice to Have

-   Advanced contradiction detection.
-   Sophisticated scoring.
-   Advanced evidence visualization.
-   Large automated test matrix.
-   Complex multi-provider failover.
-   Additional architectural abstractions.

If time becomes tight, **P2 features must be dropped first**.

------------------------------------------------------------------------

# 11. Phase A --- Backend Foundation

**Time Budget: \~30 minutes**

### Objective

Create a clean Node.js + Express + TypeScript backend foundation.

### Scope

Create:

``` text
backend/
├── src/
│   ├── server.ts
│   ├── config/
│   │   └── env.ts
│   └── routes/
│       └── interview.ts
├── tests/
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### Tasks

-   Initialize Node.js project.
-   Configure TypeScript.
-   Configure Express.
-   Add JSON parsing.
-   Configure CORS.
-   Add environment configuration.
-   Add `GET /health`.
-   Add `POST /api/interview` stub.
-   Add basic 404 handling.
-   Add centralized error handling.
-   Protect `.env` from Git.
-   Add basic development documentation.

### Important restriction

Do not implement AI, sessions, candidate loading, or frontend
integration in this phase.

### Acceptance Criteria

``` text
GET /health
→ success

POST /api/interview
→ reachable

Malformed request
→ handled without crashing

TypeScript compilation
→ passes
```

------------------------------------------------------------------------

# 12. Phase B --- Data + Session Management

**Time Budget: \~45 minutes**

### Objective

Load the supplied hackathon data and establish reliable in-memory
interview sessions.

### Data

Use:

``` text
data/curriculum.json
data/candidates.json
```

Load the data once at startup.

### Data Service

Provide simple accessors such as:

``` text
getCandidate(id)
getDay(dayId)
getModules()
```

No database is required.

### Session Service

Use an in-memory structure:

``` text
Map<sessionId, InterviewSession>
```

The session should contain:

``` text
candidate
conversation
questionsAsked
daysCovered
candidateModel
evidence
status
```

### Acceptance Criteria

-   First request creates a session.
-   Same `sessionId` retrieves the same session.
-   Candidate data is available.
-   Curriculum data is available.
-   Conversation state persists across requests.
-   No external database is required.

### Time-saving fallback

If time becomes tight, keep the Candidate Model minimal and prioritize:

-   session
-   conversation
-   question count
-   days covered

------------------------------------------------------------------------

# 13. Phase C --- LLM Provider Integration

**Time Budget: \~45 minutes**

### Objective

Connect the backend to cloud-hosted LLM inference.

### Primary

``` text
Groq
```

### Secondary

``` text
Mistral
```

### Minimal abstraction

Conceptually:

``` text
LLMProvider
    ↓
generateInterviewTurn(context)
```

Provider implementations:

``` text
GroqProvider
MistralProvider
```

### Provider Rules

-   Interview service must not import provider SDK/client logic
    directly.
-   Groq is attempted first.
-   Mistral may be attempted if Groq fails and the fallback is
    implemented in time.
-   Never expose API keys to the frontend.
-   Never hardcode secrets.

### Structured LLM Output

The LLM should return structured information such as:

``` text
reply
questionDay
topic
evidenceNote
signal
```

The exact schema should follow the implementation and technical
specification.

### Acceptance Criteria

A valid interview context produces a structured interview turn.

If Groq is unavailable, the backend must not crash the entire process.

### Time-saving fallback

If Mistral integration begins consuming too much time:

> Complete Groq first and defer Mistral fallback to P1.

------------------------------------------------------------------------

# 14. Phase D --- Interview Orchestration / Adaptive Loop

**Time Budget: \~2 hours**

This is the **core phase** and should receive the highest priority.

### Objective

Implement the actual IntervueX interview intelligence.

### Main flow

``` text
Load/Create Session
        ↓
Load Candidate + Curriculum Context
        ↓
Read Conversation
        ↓
Read Candidate Model
        ↓
Determine Current Interview Objective
        ↓
Call LLM
        ↓
Generate Next Question
        ↓
Candidate Answers
        ↓
Evaluate Answer
        ↓
Extract Lightweight Evidence
        ↓
Update Candidate Model
        ↓
Update Questions Asked
        ↓
Update Curriculum Days Covered
        ↓
Check Completion
        ↓
Continue OR Complete
```

### Backend-owned counters

The backend computes:

``` text
readyToConclude =
questionsAsked >= 8
AND
daysCovered.size >= 4
```

The LLM cannot override this.

### Adaptive behavior

The prompt should explicitly instruct the LLM to:

-   Ask follow-ups when evidence is weak.
-   Ask clarifying questions when answers are vague.
-   Increase difficulty after strong answers.
-   Investigate uncertainty.
-   Avoid blindly repeating topics.
-   Use previous answers.
-   Use evidence already collected.
-   Explore additional curriculum days.
-   Resolve contradictions where practical.

### Context

Each LLM turn should receive the relevant context:

-   Candidate profile.
-   Curriculum context.
-   Completed/skipped curriculum days.
-   Conversation history.
-   Current candidate model.
-   Evidence collected.
-   Current question objective.
-   Explicit interview rules.

Do not expose internal chain-of-thought.

### Structured output

Validate every LLM response before using it.

If structured parsing fails:

1.  Retry once.
2.  If still invalid, use a safe fallback response.
3.  Never let malformed LLM output crash the interview.

### Acceptance Criteria

A complete scripted run must demonstrate:

``` text
8+ questions
AND
4+ distinct curriculum days
AND
follow-up questions
AND
conversation context
AND
adaptive behavior
```

Later questions should visibly reference earlier answers where
appropriate.

### Time-saving fallback

If time becomes critical:

-   Keep evidence as a lightweight structured object.
-   Keep confidence updates simple.
-   Prioritize adaptive follow-ups and completion enforcement.
-   Do not build a separate evidence service.

------------------------------------------------------------------------

# 15. Phase E --- Completion + Feedback

**Time Budget: \~30 minutes**

### Objective

Generate final structured feedback after the backend completion
conditions are satisfied.

### Completion rule

The interview cannot be marked complete before:

``` text
8 questions
+
4 curriculum days
```

unless a controlled error/fallback path is being demonstrated.

### Final LLM call

Use the full relevant transcript plus accumulated candidate
model/evidence to generate:

``` json
{
  "summary": "...",
  "strengths": [],
  "gaps": [],
  "next": []
}
```

### Feedback should communicate

-   Overall technical assessment.
-   Demonstrated strengths.
-   Evidence-backed weaknesses.
-   Technical gaps.
-   Recommended next steps.

### Acceptance Criteria

The final response exactly matches the required feedback structure.

### Time-saving fallback

If the Dynamic Candidate Model is incomplete, final feedback can still
be generated from:

-   transcript
-   curriculum coverage
-   lightweight evidence

The result must remain structured and actionable.

------------------------------------------------------------------------

# 16. Phase F --- Backend Testing

**Time Budget: \~30 minutes**

### Objective

Verify the backend independently before touching the frontend.

Use 2--3 candidates from `candidates.json`.

At minimum test:

-   Strong candidate.
-   Weaker candidate.
-   One candidate with an answer that should trigger a follow-up.

### Verify

``` text
Session creation
Session retrieval
Question generation
Conversation persistence
Question count
Curriculum coverage
Adaptive follow-up
Final feedback
Malformed requests
Missing/invalid session
LLM failure handling
```

### Minimum successful run

``` text
Q1
Q2
Q3
Q4
Q5
Q6
Q7
Q8
...
```

with at least four distinct curriculum days.

### Time-saving rule

Do not build a large automated test matrix unless P0 functionality is
already stable.

------------------------------------------------------------------------

# 17. Phase G --- Frontend Integration

**Time Budget: \~45 minutes**

Only begin this after the backend works independently.

### Replace

The existing local/static interview simulation.

The frontend currently contains local interview behavior and simulated
timing/state.

Replace the driver with the real API.

### Integration

Create/use:

``` text
lib/api.ts
```

Conceptually:

``` text
startInterview(candidate)
sendMessage(sessionId, message)
```

### Update

`useInterviewSession` should:

-   Create a real session.
-   Call the backend.
-   Use the real `reply`.
-   Use the real `done` state.
-   Stop relying on the static interview queue.
-   Stop relying on artificial delays.

### Results

Render the actual backend `feedback` object.

### Acceptance Criteria

A complete interview can be performed through the existing UI against
the live backend.

------------------------------------------------------------------------

# 18. Phase H --- End-to-End Testing + Demo Preparation

**Time Budget: \~30 minutes**

### Objective

Perform one clean final run as if a judge were using the application.

### Verify

-   Frontend starts.
-   Backend starts.
-   API connection works.
-   Candidate selection works.
-   Interview starts.
-   Questions are generated.
-   Answers are submitted.
-   Follow-ups adapt.
-   8+ questions are reached.
-   4+ curriculum days are covered.
-   Interview completes.
-   Feedback renders.
-   No console/runtime errors.
-   No API keys are exposed.

### Demo principle

Do not optimize the demo around architecture diagrams.

Optimize around the visible behavior:

``` text
Candidate Profile
      ↓
Initial Claim
      ↓
IntervueX Tests Claim
      ↓
Candidate Gives Weak/Strong Answer
      ↓
Evidence Appears
      ↓
Candidate Understanding Changes
      ↓
IntervueX Adapts
      ↓
Final Evidence-Based Assessment
```

------------------------------------------------------------------------

# 19. Time Management / Cut Order

If we fall behind, cut features in this order:

``` text
1. Advanced Evidence Page
2. Sophisticated confidence tracking
3. Mistral fallback
4. Multi-candidate automated test matrix
5. Advanced contradiction detection
6. Advanced visualizations
```

Do **not** cut:

``` text
Groq integration
Session state
Conversation context
8-question requirement
4-day curriculum coverage
Adaptive follow-ups
Final feedback
Frontend integration
```

These are core to the submission.

------------------------------------------------------------------------

# 20. Conceptual Modules vs Actual Code Modules

The project still conceptually contains:

-   Candidate Understanding
-   Candidate Model
-   Interview Planner
-   Question Generator
-   Answer Evaluator
-   Evidence Engine
-   Dynamic Candidate Model
-   Adaptive Interview
-   Completion
-   Final Assessment

However, the hackathon implementation combines these responsibilities
into:

``` text
dataService
       ↓
sessionService
       ↓
interviewService
       ↓
llmService
```

with supporting:

``` text
prompts/
schemas/
types/
routes/
```

This is intentional.

It preserves the product's intelligent behavior without creating
unnecessary service boundaries.

------------------------------------------------------------------------

# 21. Backend Out-of-Scope Guardrails

Do not spend today's implementation time on:

-   Voice interaction
-   User authentication
-   Persistent user accounts
-   Long-term conversation history
-   Native mobile applications
-   SQL database
-   MongoDB
-   Vector database
-   Embeddings database
-   RAG infrastructure
-   Local LLM hosting
-   Complex microservices
-   Unnecessary background workers
-   Elaborate multi-agent orchestration

The challenge data is synthetic and the required interview can be
implemented with in-memory state.

------------------------------------------------------------------------

# 22. Error Handling & Resilience

The backend should gracefully handle:

-   Invalid request.
-   Missing session.
-   Invalid session ID.
-   Empty candidate response.
-   LLM timeout.
-   LLM rate limit.
-   Provider failure.
-   Malformed LLM response.
-   Missing candidate.
-   Missing curriculum data.

The interview should not crash because of one malformed model response.

### Provider failure strategy

Preferred:

``` text
Groq
 ↓ failure
Mistral
 ↓ failure
Safe fallback
```

But the fallback chain is P1.

A reliable Groq implementation is more important than an unfinished
provider system.

------------------------------------------------------------------------

# 23. Performance Principles

Optimize for a smooth hackathon demo.

Prefer:

-   One primary LLM call per turn where practical.
-   Deterministic backend rules for counters and completion.
-   In-memory session state.
-   Minimal prompt size consistent with context.
-   No unnecessary AI calls.
-   No database overhead.
-   No unnecessary vector retrieval.

The backend should perform deterministic work wherever AI reasoning is
not required.

------------------------------------------------------------------------

# 24. Documentation

Documentation must remain synchronized with the implementation.

Maintain:

-   `README.md`
-   `backend/README.md`
-   `PROMPTS.md`
-   `docs/technical-spec.md`
-   `docs/FRONTEND_DESIGN_SPEC.md`
-   `roadmap.md`

The roadmap should be updated whenever the implementation strategy
materially changes.

`PROMPTS.md` should contain actual AI-assisted development prompts used
during development.

Do not fabricate prompts or development activity.

------------------------------------------------------------------------

# 25. Multi-AI Development Workflow

Use AI tools with clearly separated responsibilities.

### ChatGPT --- Technical Lead / Architect

Responsibilities:

-   Architecture
-   Planning
-   Technical decisions
-   Reviewing Claude output
-   Debugging strategy
-   Prompt design
-   Hackathon strategy
-   Coordination
-   Requirement verification

### Claude Code --- Primary Coding Agent

Responsibilities:

-   Backend implementation
-   Multi-file changes
-   Refactoring
-   Testing
-   Large features
-   Codebase exploration

### Cursor --- Interactive Development / Integration

Potential responsibilities:

-   Frontend changes
-   API integration
-   Interactive debugging
-   Codebase exploration

### Gemini --- Independent Reviewer

Potential responsibilities:

-   Independent review
-   Finding bugs
-   Alternative approaches
-   Challenging architectural decisions
-   Reviewing implementation quality

### GitHub --- Source of Truth

GitHub remains the canonical project source.

Avoid repeatedly transferring ZIP files between AI tools once the
repository workflow is established.

------------------------------------------------------------------------

# 26. Multi-AI Collaboration Rule

Do not allow multiple AI agents to randomly edit the same files
simultaneously.

Preferred workflow:

``` text
AI A
 ↓
Implement
 ↓
Test
 ↓
Git Commit
 ↓
AI B
 ↓
Review
 ↓
Human / ChatGPT Decision
 ↓
Fix
 ↓
Merge
```

For larger features, use Git branches.

This avoids:

-   Conflicting changes
-   Lost code
-   Unclear ownership
-   Difficult debugging

------------------------------------------------------------------------

# 27. Development Rules

## Rule 1 --- One Step at a Time

Never attempt to implement the entire roadmap simultaneously.

For every implementation phase:

``` text
Plan
 ↓
Implement
 ↓
Test
 ↓
Share Results
 ↓
Review
 ↓
Adjust
 ↓
Next Phase
```

The roadmap is a living plan.

------------------------------------------------------------------------

## Rule 2 --- Follow Evidence, Not Assumptions

Verify before assuming.

Inspect:

-   Existing code
-   Specifications
-   Types
-   API contracts
-   Test results
-   Runtime behavior

before making architectural decisions.

------------------------------------------------------------------------

## Rule 3 --- Don't Over-Engineer

Avoid complexity unless it improves the actual product.

Especially evaluate carefully before adding:

-   Multiple LLMs
-   Complex orchestration
-   Databases
-   Authentication
-   Persistent accounts
-   Features outside the hackathon requirements

------------------------------------------------------------------------

## Rule 4 --- Don't Perform Speculative Refactoring

Do not rewrite working components merely for stylistic reasons.

Prioritize:

1.  Correctness
2.  Requirements
3.  Reliability
4.  Maintainability
5.  Performance
6.  Polish

------------------------------------------------------------------------

## Rule 5 --- Preserve the Core Differentiator

Every major AI/backend decision should answer:

> **Does this make IntervueX better at evidence-driven adaptive
> interviewing?**

If not, question whether it belongs in the project.

------------------------------------------------------------------------

# 28. Final Target Flow

The completed system should operate as:

``` text
Candidate Selection
        ↓
Start Interview
        ↓
POST /api/interview
        ↓
Create Session
        ↓
Candidate + Curriculum Context
        ↓
Groq LLM
        ↓
Question
        ↓
Candidate Answer
        ↓
Conversation Stored
        ↓
Evidence Extracted
        ↓
Candidate Model Updated
        ↓
Confidence / Assessment Updated
        ↓
Adaptive Follow-up
        ↓
Repeat
        ↓
8+ Questions
        ↓
4+ Curriculum Days
        ↓
Completion
        ↓
Final LLM Assessment
        ↓
Structured Feedback
        ↓
Frontend Results
```

------------------------------------------------------------------------

# 29. Final Product Story

The entire implementation should reinforce one simple story:

> **IntervueX doesn't simply ask questions. It investigates what the
> candidate actually knows.**

A candidate enters with an initial profile.

IntervueX treats that profile as a hypothesis.

The candidate answers questions.

The system collects evidence.

Evidence changes confidence.

Weak performance triggers deeper questioning.

Strong performance increases difficulty.

Contradictions can trigger verification.

The candidate model evolves.

The interview adapts.

Finally, IntervueX produces an assessment based on what the candidate
demonstrated, not merely what the candidate claimed.

That is the product story the backend, AI system, UX, architecture and
demo should reinforce.

------------------------------------------------------------------------

# 30. Today's Backend Execution Status

## Current objective

Complete the backend and live frontend integration within the remaining
hackathon time.

### Current approved sequence

``` text
PHASE A — Backend Foundation
        ↓
PHASE B — Data + Session Management
        ↓
PHASE C — Groq LLM Integration
        ↓
PHASE D — Adaptive Interview Loop
        ↓
PHASE E — Completion + Feedback
        ↓
PHASE F — Backend Testing
        ↓
PHASE G — Frontend Integration
        ↓
PHASE H — End-to-End Testing + Demo
```

### Current status

-   [ ] Phase A --- Backend Foundation
-   [ ] Phase B --- Data + Session Management
-   [ ] Phase C --- LLM Provider Integration
-   [ ] Phase D --- Interview Orchestration / Adaptive Loop
-   [ ] Phase E --- Completion + Feedback
-   [ ] Phase F --- Backend Testing
-   [ ] Phase G --- Frontend Integration
-   [ ] Phase H --- End-to-End Testing + Demo

### Current LLM decision

``` text
Anthropic SDK       ❌ Removed
Local LLMs          ❌ Not used
Ollama              ❌ Not used
llama.cpp            ❌ Not used

Groq                ✅ Primary
Mistral             🟡 Secondary / fallback
```

### Current architecture decision

``` text
Large conceptual architecture
              ↓
Compact hackathon implementation
              ↓
Real adaptive interview
              ↓
Reliable P0 requirements
```

### Final success condition

The project is considered demo-ready when a judge can:

1.  Select a candidate.
2.  Start an interview.
3.  Have a real cloud-hosted AI conduct the interview.
4.  Answer multiple technical questions.
5.  Observe meaningful follow-up behavior.
6.  See the interview cover at least four curriculum days.
7.  Complete at least eight questions.
8.  Receive structured, evidence-based feedback.

The architecture exists to support this experience --- not the other way
around.
