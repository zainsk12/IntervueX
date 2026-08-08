import { NavLink, Outlet } from 'react-router-dom'
import { APP_ROUTES } from '../data/routes'

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    'rounded-md px-2.5 py-1.5 text-sm transition-colors',
    isActive
      ? 'bg-surface-default text-text-primary'
      : 'text-text-secondary hover:text-text-primary',
  ].join(' ')
}

export default function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary antialiased">
      <header className="border-b border-border-subtle bg-bg-subtle">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-lg font-semibold tracking-tight">IntervueX</p>
            <p className="text-xs text-text-tertiary">
              Don&apos;t interview the resume. Interview the evidence.
            </p>
          </div>
          <nav
            aria-label="Primary"
            className="flex flex-wrap gap-1 sm:justify-end"
          >
            {APP_ROUTES.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                end={route.path === '/'}
                className={navLinkClassName}
              >
                {route.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border-subtle bg-bg-subtle">
        <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-6">
          <p className="text-xs text-text-tertiary">
            Application shell — routing foundation
          </p>
        </div>
      </footer>
    </div>
  )
}
