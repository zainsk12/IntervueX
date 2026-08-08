import { FOCUS_AREAS } from '../../data/interviewSetup'
import type { FocusArea } from '../../types/interview'

interface FocusAreaGridProps {
  selected: FocusArea[]
  onToggle: (value: FocusArea) => void
}

export function FocusAreaGrid({ selected, onToggle }: FocusAreaGridProps) {
  return (
    <div
      aria-label="Technical focus areas"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3"
      role="group"
    >
      {FOCUS_AREAS.map((area) => {
        const isSelected = selected.includes(area.value)

        return (
          <button
            aria-pressed={isSelected}
            className={`flex flex-col items-start gap-1 rounded-md border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary ${
              isSelected
                ? 'border-accent-primary/40 bg-bg-elevated'
                : 'border-border-default bg-surface-default hover:border-border-strong hover:bg-surface-muted'
            }`}
            key={area.value}
            onClick={() => onToggle(area.value)}
            type="button"
          >
            <span
              className={`font-mono text-[10px] uppercase tracking-wide ${
                isSelected ? 'text-accent-primary' : 'text-text-tertiary'
              }`}
            >
              {area.meta}
            </span>
            <span className="text-sm text-text-primary">{area.label}</span>
          </button>
        )
      })}
    </div>
  )
}