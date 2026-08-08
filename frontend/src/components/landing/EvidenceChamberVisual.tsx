import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { EVIDENCE_FLOW_STAGES } from '../../data/landing'

const statusStyles = {
  baseline: 'border-border-default bg-surface-muted',
  active: 'border-accent-secondary/50 bg-bg-elevated',
  neutral: 'border-border-default bg-surface-default',
  evidence: 'border-accent-primary/40 bg-bg-elevated',
  updated: 'border-accent-primary/60 bg-surface-default',
} as const

const statusLabels = {
  baseline: 'HYPOTHESIS',
  active: 'ACTIVE',
  neutral: 'CAPTURED',
  evidence: 'VERIFIED',
  updated: 'REVISED',
} as const

export function EvidenceChamberVisual() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      aria-label="Evidence chamber: candidate response evaluated into assessment"
      className="overflow-hidden rounded-lg border border-border-default bg-bg-inset"
    >
      <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3 sm:px-5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-tertiary">
            Evidence Chamber
          </span>
          <span className="hidden h-3 w-px bg-border-default sm:block" />
          <span className="hidden font-mono text-[10px] text-text-tertiary sm:inline">
            session://adaptive-0847
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {!reduceMotion ? (
              <motion.span
                animate={{ opacity: [1, 0.35, 1] }}
                className="absolute inline-flex h-full w-full rounded-full bg-success"
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            ) : null}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-success">
            Live
          </span>
        </div>
      </div>

      <div className="grid gap-px bg-border-subtle sm:grid-cols-5">
        {EVIDENCE_FLOW_STAGES.map((stage, index) => (
          <motion.div
            key={stage.id}
            className={`relative flex flex-col p-4 sm:min-h-[168px] sm:p-3 lg:p-4 ${statusStyles[stage.status]}`}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            viewport={{ once: true, margin: '-40px' }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-tertiary">
                {stage.label}
              </span>
              <span
                className={`font-mono text-[9px] uppercase tracking-wider ${
                  stage.status === 'evidence' || stage.status === 'updated'
                    ? 'text-accent-primary'
                    : 'text-text-tertiary'
                }`}
              >
                {statusLabels[stage.status]}
              </span>
            </div>

            <p className="font-mono text-[10px] text-accent-secondary">{stage.meta}</p>
            <p className="mt-2 text-sm font-medium leading-snug text-text-primary">
              {stage.title}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-text-secondary">{stage.detail}</p>

            {index < EVIDENCE_FLOW_STAGES.length - 1 ? (
              <div
                aria-hidden="true"
                className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 sm:block"
              >
                <ArrowRight className="h-3.5 w-3.5 text-border-strong" strokeWidth={1.5} />
              </div>
            ) : null}
          </motion.div>
        ))}
      </div>

      <div className="border-t border-border-subtle px-4 py-3 sm:px-5">
        <p className="font-mono text-[10px] leading-relaxed text-text-tertiary">
          <span className="text-accent-primary">evidence_pipeline</span>
          {' · '}
          candidate → question → response → evidence → assessment
        </p>
      </div>
    </section>
  )
}
