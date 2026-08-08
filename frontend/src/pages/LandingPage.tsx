import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EvidenceChamberVisual } from '../components/landing/EvidenceChamberVisual'
import {
  ADAPTIVE_STEPS,
  DIFFERENTIATION_POINTS,
  HOW_IT_WORKS,
  LANDING_NAV,
  TRADITIONAL_STEPS,
} from '../data/landing'
import { ROUTES } from '../data/routes'

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function PrimaryButton({
  to,
  children,
  className = '',
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  return (
    <Link
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-accent-primary px-5 py-2.5 text-sm font-semibold text-bg-base transition-colors hover:bg-accent-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-primary ${className}`}
      to={to}
    >
      {children}
    </Link>
  )
}

function SecondaryButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      className="inline-flex items-center justify-center gap-2 rounded-md border border-border-default bg-transparent px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-surface-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent-secondary">
      {children}
    </p>
  )
}

function FadeIn({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.4, delay }}
      viewport={{ once: true, margin: '-60px' }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="bg-bg-base">
      {/* Landing header */}
      <div className="border-b border-border-subtle bg-bg-subtle/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            className="group inline-flex flex-col"
            to={ROUTES.LANDING}
          >
            <span className="text-base font-semibold tracking-tight text-text-primary transition-colors group-hover:text-accent-primary">
              IntervueX
            </span>
            <span className="hidden font-mono text-[10px] text-text-tertiary sm:block">
              evidence-driven assessment
            </span>
          </Link>

          <nav aria-label="Landing sections" className="hidden items-center gap-1 md:flex">
            {LANDING_NAV.map((item) => (
              <button
                key={item.id}
                className="rounded-md px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary"
                onClick={() => scrollToSection(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <PrimaryButton className="px-4 py-2 text-sm" to={ROUTES.INTERVIEW_SETUP}>
            Start an Interview
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </PrimaryButton>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border-subtle">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(201,168,76,0.04)_0%,transparent_42%)]"
        />
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:py-20">
          <FadeIn>
            <SectionLabel>Technical interview platform</SectionLabel>
            <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-[1.12] tracking-tight text-text-primary sm:text-4xl lg:text-[2.65rem]">
              Don&apos;t interview the resume.{' '}
              <span className="text-accent-primary">Interview the evidence.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
              IntervueX conducts adaptive technical interviews that evolve with each
              response—probing demonstrated knowledge instead of running through a fixed
              questionnaire.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryButton to={ROUTES.INTERVIEW_SETUP}>
                Start an Interview
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </PrimaryButton>
              <SecondaryButton onClick={() => scrollToSection('how-it-works')}>
                See how it works
              </SecondaryButton>
            </div>
            <p className="mt-6 max-w-md font-mono text-[11px] leading-relaxed text-text-tertiary">
              profile_hypothesis → adaptive_probe → evidence_signal → competency_update
            </p>
          </FadeIn>

          <FadeIn delay={0.08}>
            <EvidenceChamberVisual />
          </FadeIn>
        </div>
      </section>

      {/* Product differentiation */}
      <section className="border-b border-border-subtle" id="approach">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:py-22">
          <FadeIn>
            <SectionLabel>Product differentiation</SectionLabel>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Fixed scripts measure preparation. Evidence measures capability.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary">
              Traditional interviews follow the same question list for every candidate.
              IntervueX treats each answer as evidence—and adapts what it asks next.
            </p>
          </FadeIn>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {DIFFERENTIATION_POINTS.map((point, index) => (
              <FadeIn key={point.id} delay={index * 0.06}>
                <article
                  className={`flex h-full flex-col rounded-lg border p-5 sm:p-6 ${
                    point.id === 'adaptive'
                      ? 'border-accent-primary/30 bg-bg-elevated'
                      : 'border-border-default bg-surface-muted'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-text-primary">{point.heading}</h3>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
                      {point.id === 'adaptive' ? 'adaptive' : 'static'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                    {point.summary}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {point.traits.map((trait) => (
                      <li
                        key={trait}
                        className="flex items-start gap-2.5 text-sm text-text-secondary"
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            point.id === 'adaptive' ? 'bg-accent-primary' : 'bg-border-strong'
                          }`}
                        />
                        {trait}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 grow rounded-md border border-border-subtle bg-bg-inset p-4">
                    {point.id === 'fixed' ? (
                      <div className="space-y-2">
                        {TRADITIONAL_STEPS.map((step, stepIndex) => (
                          <div
                            key={step.id}
                            className="flex items-center gap-3 rounded-sm border border-border-default bg-surface-default px-3 py-2"
                          >
                            <span className="font-mono text-[10px] text-text-tertiary">
                              {step.label}
                            </span>
                            <span className="text-xs text-text-secondary">{step.text}</span>
                            {stepIndex < TRADITIONAL_STEPS.length - 1 ? (
                              <ChevronRight
                                aria-hidden="true"
                                className="ml-auto h-3.5 w-3.5 text-border-strong"
                              />
                            ) : null}
                          </div>
                        ))}
                        <p className="pt-1 font-mono text-[10px] text-text-tertiary">
                          sequence: fixed · no model update
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {ADAPTIVE_STEPS.map((step, stepIndex) => (
                          <div
                            key={step.id}
                            className="rounded-sm border border-accent-primary/20 bg-surface-default px-3 py-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[10px] text-accent-secondary">
                                {step.label}
                              </span>
                              <span className="font-mono text-[10px] text-accent-primary">
                                {step.evidence}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-text-primary">{step.text}</p>
                            {stepIndex < ADAPTIVE_STEPS.length - 1 ? (
                              <p className="mt-2 font-mono text-[10px] text-text-tertiary">
                                ↳ evidence gap detected → next probe selected
                              </p>
                            ) : null}
                          </div>
                        ))}
                        <p className="pt-1 font-mono text-[10px] text-accent-primary">
                          path: adaptive · competency model updated
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border-subtle" id="how-it-works">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18 lg:py-22">
          <FadeIn>
            <SectionLabel>How it works</SectionLabel>
            <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              From profile hypothesis to evidence-backed assessment
            </h2>
          </FadeIn>

          <ol className="mt-10 space-y-0">
            {HOW_IT_WORKS.map((step, index) => {
              const Icon = step.icon
              const isLast = index === HOW_IT_WORKS.length - 1

              return (
                <FadeIn key={step.id} delay={index * 0.05}>
                  <li className="relative grid gap-4 pb-8 sm:grid-cols-[auto_1fr] sm:gap-6 lg:grid-cols-[72px_1fr_auto] lg:items-start">
                    {!isLast ? (
                      <span
                        aria-hidden="true"
                        className="absolute left-[17px] top-10 hidden h-[calc(100%-12px)] w-px bg-border-default sm:block lg:left-[35px]"
                      />
                    ) : null}

                    <div className="flex items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-border-default bg-surface-default">
                        <Icon
                          aria-hidden="true"
                          className="h-4 w-4 text-accent-secondary"
                          strokeWidth={1.75}
                        />
                      </div>
                      <span className="font-mono text-[11px] text-text-tertiary">{step.step}</span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-text-primary sm:text-lg">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
                        {step.description}
                      </p>
                    </div>

                    {!isLast ? (
                      <div
                        aria-hidden="true"
                        className="hidden items-center lg:flex"
                      >
                        {!reduceMotion ? (
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                          >
                            <ArrowRight className="h-4 w-4 text-border-strong" strokeWidth={1.5} />
                          </motion.div>
                        ) : (
                          <ArrowRight className="h-4 w-4 text-border-strong" strokeWidth={1.5} />
                        )}
                      </div>
                    ) : null}
                  </li>
                </FadeIn>
              )
            })}
          </ol>

          <FadeIn>
            <div className="overflow-x-auto rounded-lg border border-border-default bg-bg-inset p-4">
              <p className="font-mono text-[11px] leading-relaxed text-text-tertiary">
                <span className="text-text-secondary">flow</span>
                {' · '}
                Candidate Profile → Initial Assessment → Adaptive Interview → Evidence
                Collection → Competency Assessment
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-bg-subtle">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-18">
          <FadeIn>
            <div className="rounded-lg border border-border-default bg-bg-elevated px-5 py-10 sm:px-8 sm:py-12">
              <SectionLabel>Ready to begin</SectionLabel>
              <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                Start an evidence-driven technical interview
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-text-secondary">
                Set up a candidate profile and let IntervueX adapt the interview based on
                what gets demonstrated—not what was written on a resume.
              </p>
              <div className="mt-8">
                <PrimaryButton to={ROUTES.INTERVIEW_SETUP}>
                  Start an Interview
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </PrimaryButton>
              </div>
              <p className="mt-5 font-mono text-[10px] text-text-tertiary">
                route: {ROUTES.INTERVIEW_SETUP}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
