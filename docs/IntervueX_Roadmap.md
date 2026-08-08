IntervueX — Development Roadmap
1. Project Vision
Project Name
IntervueX
Tagline
Don't interview the resume. Interview the evidence.
Product Vision
IntervueX is an adaptive AI technical interviewer designed to conduct realistic, multi-turn technical interviews based on:
Candidate profile
Learning journey
Curriculum progress
Candidate responses
Evidence demonstrated during the interview
Confidence
Uncertainty
Contradictions
Competency assessments
The system should continuously update its understanding of the candidate throughout the interview instead of treating the candidate profile as absolute truth.

2. Core Product Principle
IntervueX must not become a generic AI chatbot or a static question-answer system.
The core intelligence should follow:
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
Adaptive Question
↓
New Evidence
↓
Updated Candidate Model
↓
Repeat
↓
Evidence-Based Final Assessment
The interview itself should change what IntervueX believes about the candidate.

3. Hackathon Requirements
The implementation must satisfy the core requirements of the Interview Agent problem:
Conduct a conversational technical interview.
Ask at least 8 questions.
Cover at least 4 different curriculum days/topics.
Generate follow-up questions based on previous responses.
Maintain conversation context.
Adapt questions according to candidate performance.
Produce structured feedback.
Provide evidence-based assessment.
Expose the required HTTP endpoint/API defined in the technical specification.

4. Product Architecture
The overall system should be organized around the following major layers:
Candidate / Curriculum Data
↓
Candidate Understanding
↓
Initial Candidate Model
↓
Interview Planner
↓
Question Generator
↓
Candidate Response
↓
Answer Evaluator
↓
Evidence Extraction
↓
Dynamic Candidate Model
↓
Adaptive Interview Planner
↓
Next Question
↓
Interview Completion
↓
Final Assessment
Supporting layers:
┌─────────────────┐
│  Candidate Data │
└────────┬────────┘
↓
┌─────────────────┐
│ Candidate Model │
└────────┬────────┘
↓
┌───────────────┴───────────────┐
↓                               ↓
Interview Planner                AI Evaluation
↓                               ↓
Question Generator               Evidence Engine
↓                               ↓
└───────────────┬───────────────┘
↓
Dynamic Candidate Model
↓
Next Question

5. Phase 1 — Foundation & Project Infrastructure
Objective
Establish the technical foundation required for reliable development and integration.
Tasks
Define final project architecture.
Establish frontend/backend separation.
Configure environment variables.
Configure local development environment.
Establish Git workflow.
Define development branches where appropriate.
Establish frontend ↔ backend communication.
Define API base configuration.
Establish development and production configuration strategy.
Define error-handling conventions.
Define logging conventions.
Define API response/error conventions.
Deliverable
A clean foundation on which all subsequent backend and AI functionality can be implemented.

6. Phase 2 — Data Integration
Objective
Integrate the supplied hackathon data into the application.
Data Sources
Curriculum JSON
Candidate Profiles
Other supplied hackathon data
Technical Specification
Tasks
Inspect curriculum structure.
Inspect candidate profile structure.
Define internal data models.
Create curriculum access layer.
Create candidate profile access layer.
Validate supplied JSON.
Normalize data where necessary.
Establish competency/topic relationships.
Map curriculum days to competencies.
Make candidate data available to the interview engine.
Deliverable
A reliable data layer that allows IntervueX to understand:
Candidate
+
Learning Journey
+
Curriculum
+
Competencies
The supplied curriculum and candidate data should remain the primary source for the hackathon scenario.

7. Phase 3 — Initial Candidate Analyzer
Objective
Convert the supplied candidate profile into an initial competency hypothesis.
Tasks
Analyze:
Candidate profile
Experience
Learning progress
Claimed competencies
Curriculum exposure
Relevant technical topics
Generate an initial candidate model containing concepts such as:
Competency
Initial Assessment
Initial Confidence
Known Evidence
Uncertainty
Example
RAG
Assessment: Strong
Confidence: Initial

Agents
Assessment: Strong
Confidence: Initial

MCP
Assessment: Intermediate
Confidence: Initial

Observability
Assessment: Unknown
Confidence: Initial
The system must explicitly treat these as initial hypotheses, not verified facts.

8. Phase 4 — Dynamic Candidate Model
Objective
Build the central intelligence layer of IntervueX.
The Dynamic Candidate Model should continuously maintain:
Competencies
Examples:
RAG
Vector Databases
Prompt Engineering
Agentic AI
MCP
AI Deployment
Production AI Systems
Other curriculum competencies
Evidence
What the candidate has actually demonstrated.
Confidence
How confident the system is in its current assessment.
Uncertainty
Areas where additional evidence is required.
Contradictions
Situations where:
Candidate Profile
≠
Interview Evidence
Current Assessment
The latest evidence-backed understanding of the candidate.
The system must preserve the distinction between:
Initial Profile
≠
Current Assessment
This distinction is central to IntervueX.

9. Phase 5 — Interview Planning Engine
Objective
Create an adaptive interview planner rather than a fixed question list.
The planner should maintain:
Long-Term Objective
What the complete interview needs to establish.
Current Objective
What the interviewer is trying to learn right now.
Evidence Collected
What has already been demonstrated.
Evidence Gaps
What remains unknown.
Next Action
What question or follow-up should be asked next.
The planner should answer:
“What do we need to learn about this candidate next?”
Possible reasons for asking a question:
Verify a claimed skill.
Investigate a weakness.
Resolve a contradiction.
Increase confidence.
Explore an unassessed competency.
Increase difficulty after strong performance.
Test practical understanding.
Verify fundamentals.

10. Phase 6 — Question Generation Engine
Objective
Generate context-aware technical interview questions.
Questions should consider:
Candidate profile
Current candidate model
Interview objective
Curriculum
Previous questions
Previous answers
Evidence collected
Evidence gaps
Competency confidence
Contradictions
Current difficulty
Question Types
The system should support:
Initial competency questions
Fundamental verification questions
Follow-up questions
Clarification questions
Contradiction-resolution questions
Practical/application questions
Increasing-difficulty questions
Evidence-verification questions
The next question must be influenced by both:
Interview Plan
+
Latest Candidate Evidence
rather than simply following a predetermined list.

11. Phase 7 — Answer Evaluation Engine
Objective
Convert every candidate response into structured information.
For each response, evaluate:
Technical correctness
Conceptual understanding
Depth
Practical understanding
Relevance
Strengths
Weaknesses
Evidence
Confidence
Uncertainty
Contradictions
Competency impact
The evaluator should produce structured output that can be consumed by the Dynamic Candidate Model.
Conceptually:
Candidate Answer
↓
AI Evaluation
↓
Structured Evaluation
↓
Evidence
↓
Candidate Model Update

12. Phase 8 — Evidence Engine
Objective
Make evidence the foundation of candidate assessment.
Each useful candidate response should potentially generate evidence containing:
Candidate statement
Quote
Timestamp
Evidence tag
Competency
Assessment impact
Supporting/contradicting signal
Confidence
The system should distinguish:
Claim
Evidence
Assessment
rather than treating every candidate statement as automatically true.
Evidence should also support the final assessment and explain why a competency received a particular evaluation.

13. Phase 9 — Adaptive Interview Loop
Objective
Connect all intelligence components into a continuous interview loop.
The loop should operate as:
Understand Candidate
↓
Create Initial Profile
↓
Plan Interview Objective
↓
Ask Question
↓
Receive Answer
↓
Evaluate Response
↓
Extract Evidence
↓
Update Candidate Model
↓
Recalculate Confidence / Uncertainty
↓
Identify Evidence Gap
↓
Adapt Interview
↓
Ask Next Question
↓
Repeat
The system must not blindly execute:
Question 1
Question 2
Question 3
Question 4
...
Instead, each question should have a reason connected to the current evidence state.

14. Phase 10 — Multi-LLM Strategy
Objective
Evaluate whether multiple AI models can improve the quality and robustness of IntervueX.
Potential models/services:
Groq
Mistral
Other suitable models if required
Potential responsibilities:
Candidate Answer
↓
┌───────────────┐
↓               ↓
Model A         Model B
↓               ↓
Evaluation      Evaluation
└───────┬───────┘
↓
Reconciliation
↓
Structured Evidence
↓
Candidate Model
Potential specialization:
Question generation
Answer evaluation
Evidence extraction
Contradiction detection
Candidate model updates
Also evaluate:
Independent evaluation
Reconciliation
Model fallback
Failure handling
Cost
Latency
Quality
Multi-LLM architecture should only be retained if its benefits justify the added complexity.

15. Phase 11 — Interview Session Engine
Objective
Create the backend session layer that maintains the complete interview state.
The session should manage:
Session ID
Candidate information
Conversation context
Interview state
Current question
Question history
Candidate responses
Evidence
Candidate model
Interview objective
Progress
Final assessment
The session engine must also implement the required API contract defined by the technical specification.

16. Phase 12 — Backend API Layer
Objective
Expose the functionality required by the frontend and hackathon specification.
Before implementing endpoints, define:
Frontend Action
↓
API Endpoint
↓
Request
↓
Backend Logic
↓
Database / AI
↓
Response
↓
Frontend State
API Design Tasks
Identify required endpoints from docs/technical-spec.md.
Define request schemas.
Define response schemas.
Define validation rules.
Define error responses.
Define session lifecycle.
Define AI invocation flow.
Define evidence API.
Define assessment API.
Define persistence requirements.
Do not invent API contracts independently of the technical specification. The technical specification should remain the primary source for required endpoint behavior.

17. Phase 13 — Frontend ↔ Backend Integration
Objective
Replace temporary/local session behavior with real backend communication where required.
Integration should cover:
Candidate selection
Candidate initialization
Session creation
Interview start
Question retrieval
Answer submission
Evaluation
Evidence updates
Candidate model updates
Next-question generation
Interview completion
Results retrieval
Existing frontend types should be used to establish compatible API contracts.
Important reference areas:
frontend/src/types/interview.ts
frontend/src/types/results.ts
frontend/src/types/routes.ts
and:
frontend/src/lib/interviewSession.ts
frontend/src/lib/buildInterviewQueue.ts
frontend/src/lib/resultsAssessment.ts
frontend/src/lib/formatDate.ts

18. Phase 14 — Visible Adaptive Intelligence
Objective
Make the intelligence of IntervueX understandable to users and judges without exposing internal chain-of-thought.
The UI should communicate outcomes of the intelligence rather than hidden reasoning.
Potential visible signals:
Evidence Progression
Show evidence being accumulated during the interview.
Candidate Assessment Changes
Show when a competency assessment changes.
Profile Shift
Example:
RAG

Initial Profile
█████████░ Strong

↓

Interview Evidence

↓

Current Assessment
██████░░░░ Moderate
Current Focus
Show what competency/topic the interviewer is currently investigating.
Confidence
Show simplified confidence levels.
Evidence Count
Show how much supporting evidence exists.
The interface must never expose internal chain-of-thought or sensitive reasoning.

19. Phase 15 — Interview Completion & Assessment
Objective
Produce a structured, evidence-backed final assessment.
The completion system must ensure:
Minimum 8 questions
Coverage of at least 4 curriculum days/topics
Proper interview completion
Final candidate model
Evidence-backed assessment
Structured feedback
Final Assessment Structure
Overall Assessment
Example:
Strong Technical Candidate
Competency Assessment
RAG                 Strong
Agents              Strong
MCP                 Moderate
Deployment          Moderate
Observability       Limited Evidence
Strengths
Evidence-backed strengths.
Areas to Improve
Specific technical gaps discovered during the interview.
Recommended Next Steps
A targeted learning path based on demonstrated weaknesses.

20. Phase 16 — Error Handling & Resilience
Objective
Make the system robust against failures.
Test and handle:
Invalid candidate data
Invalid requests
Missing session
Expired/invalid session
AI model failure
AI timeout
Model rate limits
API failure
Malformed model response
Incomplete candidate response
Evidence extraction failure
Question-generation failure
Database/storage failure
Where possible, provide graceful fallback behavior rather than terminating the interview.

21. Phase 17 — Testing & Hardening
Objective
Test the complete system under different candidate behaviors and failure conditions.
Candidate Scenarios
Test at minimum:
Normal candidate
Strong candidate
Weak candidate
Fake/overstated profile
Candidate contradicting their profile
Candidate giving contradictory answers
Candidate with insufficient evidence
Candidate demonstrating strong fundamentals but weak practical knowledge
Candidate demonstrating unexpected strength
Candidate requiring repeated clarification
System Scenarios
Also test:
LLM failures
API failures
Invalid requests
Session failures
Edge cases
Question-count requirements
Curriculum coverage requirements
Follow-up generation
Evidence persistence
Final assessment consistency

22. Phase 18 — UI/UX Polish
Objective
Ensure the final product feels like a premium AI technical assessment platform rather than a generic chatbot.
Design Direction
Modern
Premium
Dark interface
Clean typography
Subtle gradients/glows
Strong cards
Minimal meaningful animations
Responsive
Professional technical aesthetic
Areas to Polish
Loading states
API waiting states
Error states
Empty states
Transitions
Responsive behavior
Interview experience
Evidence visualization
Profile-shift visualization
Assessment presentation
The UI should make the intelligence of the system understandable to judges.

23. Phase 19 — Performance & Reliability
Objective
Optimize the system for a smooth demo and reliable API behavior.
Evaluate:
LLM response latency
API latency
Number of model calls per answer
Token usage
Model costs
Frontend responsiveness
Session performance
Error recovery
Concurrent request behavior where relevant
Avoid unnecessary AI calls.
Use deterministic logic where AI is not required.

24. Phase 20 — Documentation
Objective
Keep project documentation synchronized with actual implementation.
Maintain:
README.md
frontend/README.md
PROMPTS.md
docs/technical-spec.md
docs/FRONTEND_DESIGN_SPEC.md
Documentation should cover:
Project overview
Architecture
Setup
Environment variables
API usage
AI architecture
Interview flow
Candidate model
Evidence system
Development workflow
Deployment
Demo instructions
PROMPTS.md
Maintain the AI usage log based on actual AI-assisted development history.
Do not fabricate prompts or development activity.

25. Phase 21 — Deployment
Objective
Prepare the complete application for reliable demonstration.
Tasks
Configure production environment.
Configure backend deployment.
Configure frontend deployment.
Configure API URL.
Configure environment secrets.
Verify CORS.
Verify production AI model access.
Verify supplied data availability.
Verify API endpoints.
Verify complete interview flow.
Verify error handling in production.
Verify final results generation.

26. Phase 22 — End-to-End Validation
Perform a complete demo flow:
Landing
↓
Candidate Selection
↓
Candidate Intelligence
↓
Interview Start
↓
Question
↓
Candidate Answer
↓
Evaluation
↓
Evidence
↓
Candidate Model Update
↓
Profile Shift
↓
Adaptive Follow-up
↓
Continue Interview
↓
Minimum 8 Questions
↓
4+ Curriculum Days
↓
Interview Completion
↓
Final Assessment
↓
Strengths
↓
Weaknesses
↓
Recommended Next Steps
The complete flow should demonstrate the project's central story:
The interview changes what IntervueX believes about the candidate.

27. Phase 23 — Hackathon Demo Preparation
Objective
Design the demo around the strongest differentiating behavior.
The preferred demo scenario should ideally demonstrate:
Candidate Profile Says:
RAG → Strong

↓

IntervueX Tests RAG

↓

Candidate Gives Weak Answer

↓

Evidence Contradicts Profile

↓

Candidate Model Changes

↓

Confidence Decreases

↓

IntervueX Asks Fundamental Follow-up

↓

New Evidence

↓

Assessment Changes Again
This should become the primary “wow moment” of the demonstration.

28. Phase 24 — Final Submission
Before submission, verify:
Repository
GitHub repository
Clean repository structure
No unnecessary files
No secrets
Documentation present
PROMPTS.md present
Application
Frontend deployed
Backend deployed
API working
End-to-end interview working
AI integration working
Results working
Hackathon Requirements
Minimum 8 questions
4+ curriculum days
Follow-up questions
Context maintained
Adaptive behavior
Structured feedback
Required HTTP endpoint
Evidence-based assessment
Demo
Demo candidate selected
Demo flow rehearsed
Profile-shift moment prepared
Screenshots prepared
Backup/demo fallback prepared
Judge presentation prepared
These items form the final submission checklist.

29. Multi-AI Development Workflow
Use AI tools with clearly separated responsibilities.
ChatGPT
Technical Lead / Architect
Responsibilities:
Architecture
Planning
Technical decisions
Debugging
Reviewing AI outputs
Prompt design
Hackathon strategy
Coordination
Claude Code
Primary Deep Coding Agent
Potential responsibilities:
Complex backend implementation
Multi-file changes
Refactoring
Testing
Large features
Cursor
Interactive Development Environment / Coding Agent
Potential responsibilities:
Frontend development
Integration
Debugging
Codebase exploration
Interactive implementation
Gemini
Independent Reviewer / Alternative Implementer
Potential responsibilities:
Independent code review
Finding bugs
Alternative approaches
Challenging architectural decisions
Reviewing implementation quality
GitHub
Shared Source of Truth
GitHub should remain the canonical project source instead of repeatedly transferring ZIP files between AI tools.

30. Multi-AI Collaboration Rule
Do not allow multiple AI agents to randomly edit the same files simultaneously.
Use:
AI A
↓
Implement
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
For larger features, use Git branches.
This avoids:
Conflicting changes
Lost code
Unclear ownership
Difficult debugging
Repeated ZIP transfers

31. Development Rules
Rule 1 — One Step at a Time
Never attempt to implement the entire roadmap simultaneously.
For every roadmap step:
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
Next Step
The roadmap is a living plan, not an unchangeable sequence.

Rule 2 — Follow Evidence, Not Assumptions
The same philosophy used by the product should apply to development:
Verify before assuming.
Inspect:
Existing code
Specifications
Types
API contracts
Test results
Runtime behavior
before making architectural decisions.

Rule 3 — Don't Over-Engineer
Avoid adding complexity unless it improves the actual product.
Especially evaluate carefully before adding:
Multiple LLMs
Complex orchestration
Unnecessary databases
Authentication
Persistent accounts
Features outside the hackathon requirement
The supplied planning explicitly identifies voice interaction, authentication, persistent user accounts, long-term conversation history and mobile applications as out of scope.

Rule 4 — Don't Perform Speculative Refactoring
Do not rewrite working components merely for stylistic reasons.
Prioritize:
Correctness
Requirements
Reliability
Maintainability
Performance
Polish

Rule 5 — Preserve the Core Differentiator
Every major AI/backend decision should answer:
Does this make IntervueX better at evidence-driven adaptive interviewing?
If not, question whether it belongs in the project.

32. Out-of-Scope Guardrails
Do not spend development time on features that are not required unless they directly improve the hackathon submission.
Explicitly out of scope:
Voice interaction
User authentication
Persistent user accounts
Long-term conversation history
Native mobile applications

33. Master Technical Flow
The complete target architecture can be summarized as:
┌─────────────────────┐
│ Candidate Profile   │
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Initial Candidate   │
│ Model               │
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Interview Planner   │
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Question Generator  │
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Candidate Answer    │
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Answer Evaluator    │
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Evidence Engine     │
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Dynamic Candidate   │
│ Model Update        │
└──────────┬──────────┘
↓
┌────────────────┴────────────────┐
↓                                 ↓
Confidence / Uncertainty            Contradiction
↓                                 ↓
└────────────────┬────────────────┘
↓
┌─────────────────────┐
│ Evidence Gap        │
│ Detection            │
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Adaptive Follow-up  │
│ Question            │
└──────────┬──────────┘
↓
Repeat Loop
↓
┌─────────────────────┐
│ Interview Completion│
└──────────┬──────────┘
↓
┌─────────────────────┐
│ Final Evidence-Based│
│ Assessment          │
└─────────────────────┘

34. Final Product Story
The entire roadmap should ultimately lead to one simple story:
IntervueX doesn't simply ask questions. It investigates what the candidate actually knows.
A candidate enters with an initial profile.
IntervueX treats that profile as a hypothesis.
The candidate answers questions.
The system collects evidence.
Evidence changes confidence.
Contradictions trigger verification.
Strong performance increases difficulty.
Weak performance triggers deeper questioning.
The candidate model evolves.
The interview adapts.
Finally, IntervueX produces an assessment based on what the candidate demonstrated, not merely what the candidate claimed.
That is the product story the entire architecture, AI system, UX and demo should reinforce.
