# IntervueX — Frontend Design Specification

> **Product:** IntervueX  
> **Hackathon:** ViCodathon — Problem Statement 2: The Interview Agent  
> **Design Direction:** Evidence Chamber  
> **Core Philosophy:** Don't interview the resume. Interview the evidence.

---

## 1. Product Experience

IntervueX is a next-generation AI technical interview platform.

The frontend must communicate that IntervueX:

1. Understands the candidate's initial profile.
2. Creates initial competency hypotheses.
3. Conducts an adaptive technical interview.
4. Evaluates candidate responses as evidence.
5. Updates its understanding of the candidate.
6. Adapts subsequent questions based on new evidence.
7. Produces an evidence-backed final assessment.

The product must NOT feel like:
- A generic chatbot
- A ChatGPT clone
- A conventional recruitment dashboard
- A static questionnaire
- A generic AI SaaS template

The product should feel like a:
- Premium technical assessment environment
- Intelligent interviewer
- Evidence-driven evaluation system
- Focused professional workspace

---

# 2. Core Product Philosophy

## Don't interview the resume. Interview the evidence.

A candidate profile is an initial hypothesis, not absolute truth.

Example:

Initial profile:

RAG → Strong

Interview evidence:

Candidate struggles to diagnose a RAG failure.

Current assessment:

RAG → Moderate

The interface should make this evolution understandable without exposing internal reasoning or chain-of-thought.

---

# 3. Visual Direction — Evidence Chamber

## Personality

The interface should feel:

- Composed
- Precise
- Evaluative
- Intelligent
- Technical
- Premium
- Evidence-first
- Human-adjacent

The visual language should resemble a focused technical examination environment rather than an AI assistant.

## Design Principle

Originality should come primarily from:

- Information architecture
- Interview-specific interaction patterns
- Evidence visualization
- Adaptive state visualization
- Candidate profile evolution

Do NOT rely on decorative effects to create originality.

---

# 4. Anti-Patterns

Avoid:

- Generic purple/blue AI gradients
- Excessive glassmorphism
- Floating blobs
- Neon glow effects
- Generic AI assistant chat bubbles
- Excessive rounded cards
- Equal-weight metric card grids
- Gamified XP/progress systems
- Giant circular score gauges
- Excessive animations
- Decorative elements without purpose

Do not automatically use purple or blue simply because IntervueX is an AI product.

---

# 5. Color System

Dark mode is the primary visual mode.

## Backgrounds

```text
--bg-base:     #0C0F14
--bg-subtle:   #10141C
--bg-elevated: #161B26
--bg-inset:    #0A0D12