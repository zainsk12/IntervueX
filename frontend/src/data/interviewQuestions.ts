import type { InterviewQuestion } from '../types/interview'

export const INTERVIEW_QUESTION_BANK: InterviewQuestion[] = [
  {
    id: 'q-dsa-01',
    meta: 'Q-0101',
    competency: 'Data Structures & Algorithms',
    focusArea: 'dsa',
    prompt:
      'Given a stream of page-view events, how would you find the most frequent URL in the last 5 minutes at any point in time?',
    evidenceSought: 'Correct data structure choice, handling of sliding windows, and awareness of time/space tradeoffs.',
  },
  {
    id: 'q-dsa-02',
    meta: 'Q-0102',
    competency: 'Data Structures & Algorithms',
    focusArea: 'dsa',
    prompt:
      'Walk through how you would detect a cycle in a directed graph, and explain what changes if the graph is undirected instead.',
    evidenceSought: 'Correctness of the traversal strategy and clarity on why directed vs. undirected changes the approach.',
  },
  {
    id: 'q-backend-01',
    meta: 'Q-0201',
    competency: 'Backend Engineering',
    focusArea: 'backend',
    prompt:
      'A background job that processes payments occasionally runs twice for the same event. How would you diagnose and fix this?',
    evidenceSought: 'Understanding of idempotency, at-least-once delivery, and safe retry design.',
  },
  {
    id: 'q-backend-02',
    meta: 'Q-0202',
    competency: 'Backend Engineering',
    focusArea: 'backend',
    prompt:
      'How would you structure a service that needs to call three downstream APIs, where one is frequently slow or unavailable?',
    evidenceSought: 'Reasoning about timeouts, fallbacks, and failure isolation rather than treating all calls as equally reliable.',
  },
  {
    id: 'q-apis-01',
    meta: 'Q-0301',
    competency: 'API Design',
    focusArea: 'apis',
    prompt:
      'Design a pagination strategy for an endpoint returning millions of records that are frequently inserted and deleted.',
    evidenceSought: 'Tradeoffs between offset and cursor-based pagination under a mutating dataset.',
  },
  {
    id: 'q-apis-02',
    meta: 'Q-0302',
    competency: 'API Design',
    focusArea: 'apis',
    prompt:
      'How would you version a public REST API without breaking existing integrations that depend on it?',
    evidenceSought: 'Concrete versioning strategy and awareness of backward-compatibility constraints.',
  },
  {
    id: 'q-db-01',
    meta: 'Q-0401',
    competency: 'Databases',
    focusArea: 'databases',
    prompt:
      'A query that used to run in milliseconds now takes several seconds as the table has grown. How would you investigate?',
    evidenceSought: 'Systematic diagnosis approach — indexing, query plans, and data-growth reasoning.',
  },
  {
    id: 'q-db-02',
    meta: 'Q-0402',
    competency: 'Databases',
    focusArea: 'databases',
    prompt:
      'When would you choose eventual consistency over strong consistency for a feature you are building?',
    evidenceSought: 'Ability to connect a consistency model choice to concrete product/UX consequences.',
  },
  {
    id: 'q-sysdesign-01',
    meta: 'Q-0501',
    competency: 'System Design',
    focusArea: 'system-design',
    prompt:
      'Design a URL shortener that needs to handle a sudden 10x spike in traffic during a marketing campaign.',
    evidenceSought: 'Capacity reasoning, caching strategy, and identification of the actual bottleneck.',
  },
  {
    id: 'q-sysdesign-02',
    meta: 'Q-0502',
    competency: 'System Design',
    focusArea: 'system-design',
    prompt:
      'How would you design a notification system that must not send duplicate notifications, even if a service instance crashes mid-send?',
    evidenceSought: 'Exactly-once vs. at-least-once thinking and where deduplication should actually live.',
  },
  {
    id: 'q-cloud-01',
    meta: 'Q-0601',
    competency: 'Cloud / DevOps',
    focusArea: 'cloud-devops',
    prompt:
      'A production deployment intermittently fails health checks right after rollout. How would you narrow down the cause?',
    evidenceSought: 'Structured debugging across deployment, networking, and application-startup layers.',
  },
  {
    id: 'q-cloud-02',
    meta: 'Q-0602',
    competency: 'Cloud / DevOps',
    focusArea: 'cloud-devops',
    prompt:
      'How would you decide between vertical and horizontal scaling for a service under sustained load?',
    evidenceSought: 'Grounded tradeoff reasoning rather than a generically "correct" answer.',
  },
  {
    id: 'q-frontend-01',
    meta: 'Q-0701',
    competency: 'Frontend Engineering',
    focusArea: 'frontend',
    prompt:
      'A dashboard re-renders the entire page whenever a single widget updates. How would you diagnose and address this?',
    evidenceSought: 'Understanding of render triggers, state placement, and targeted optimization over premature memoization.',
  },
  {
    id: 'q-frontend-02',
    meta: 'Q-0702',
    competency: 'Frontend Engineering',
    focusArea: 'frontend',
    prompt:
      'How would you keep a complex multi-step form usable and maintainable as more steps and conditional fields get added?',
    evidenceSought: 'State-management approach and separation of form logic from presentation.',
  },
  {
    id: 'q-arch-01',
    meta: 'Q-0801',
    competency: 'Software Architecture',
    focusArea: 'architecture',
    prompt:
      'A monolith is becoming difficult to change safely. What signals would tell you it is time to split it, and how would you approach that?',
    evidenceSought: 'Ability to identify real architectural pain points rather than defaulting to microservices as a trend.',
  },
  {
    id: 'q-arch-02',
    meta: 'Q-0802',
    competency: 'Software Architecture',
    focusArea: 'architecture',
    prompt:
      'How do you decide where to draw module boundaries in a codebase that several teams contribute to?',
    evidenceSought: 'Reasoning about ownership, coupling, and change frequency rather than folder structure alone.',
  },
]