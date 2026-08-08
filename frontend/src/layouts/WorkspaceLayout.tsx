import { Link, NavLink, Outlet } from 'react-router-dom'
import { APP_ROUTES, ROUTES } from '../data/routes'

const WORKSPACE_ROUTES = APP_ROUTES.filter((route) => route.path !== ROUTES.LANDING)

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return [
    'rounded-md px-2.5 py-1.5 text-sm transition-colors',
    isActive
      ? 'bg-surface-default text-text-primary'
      : 'text-text-secondary hover:text-text-primary',
  ].join(' ')
}

export default function WorkspaceLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary antialiased">
      <header className="border-b border-border-subtle bg-bg-subtle">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link className="group inline-flex flex-col" to={ROUTES.LANDING}>
            <span className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent-primary">
              IntervueX
            </span>
            <span className="text-xs text-text-tertiary">
              Don&apos;t interview the resume. Interview the evidence.
            </span>
          </Link>
          <nav
            aria-label="Workspace"
            className="flex flex-wrap gap-1 sm:justify-end"
          >
            {WORKSPACE_ROUTES.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
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
    </div>
  )
}