interface PlaceholderPageProps {
  title: string
  description: string
  path: string
  detail?: string
}

export function PlaceholderPage({
  title,
  description,
  path,
  detail,
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-text-tertiary">
        Placeholder
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
        {title}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-text-secondary">
        {description}
      </p>
      <p className="mt-6 font-mono text-sm text-text-tertiary">{path}</p>
      {detail ? (
        <p className="mt-2 font-mono text-sm text-accent-secondary">{detail}</p>
      ) : null}
    </section>
  )
}
