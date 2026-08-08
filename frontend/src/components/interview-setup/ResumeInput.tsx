import { FileText, UploadCloud, X } from 'lucide-react'

interface ResumeInputProps {
  id: string
  fileName: string | null
  onChange: (fileName: string | null) => void
}

export function ResumeInput({ id, fileName, onChange }: ResumeInputProps) {
  return (
    <div className="relative">
      <input
        accept=".pdf,.doc,.docx"
        className="sr-only"
        id={id}
        onChange={(event) => {
          const file = event.target.files?.[0]
          onChange(file ? file.name : null)
        }}
        type="file"
      />
      <label
        className={`flex cursor-pointer items-center gap-2.5 rounded-md border border-dashed border-border-default bg-surface-default px-3 py-2.5 text-sm text-text-secondary transition-colors hover:border-border-strong hover:bg-surface-muted ${
          fileName ? 'pr-9' : ''
        }`}
        htmlFor={id}
      >
        {fileName ? (
          <FileText aria-hidden="true" className="h-4 w-4 shrink-0 text-accent-secondary" />
        ) : (
          <UploadCloud aria-hidden="true" className="h-4 w-4 shrink-0 text-text-tertiary" />
        )}
        <span className={`min-w-0 flex-1 truncate ${fileName ? 'text-text-primary' : ''}`}>
          {fileName ?? 'Attach resume / CV (PDF, DOC, DOCX)'}
        </span>
      </label>
      {fileName ? (
        <button
          aria-label="Remove attached resume"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-text-tertiary transition-colors hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-secondary"
          onClick={() => onChange(null)}
          type="button"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
      <p className="mt-1.5 text-xs text-text-tertiary">
        Frontend selection only for this step — parsing is not yet implemented.
      </p>
    </div>
  )
}