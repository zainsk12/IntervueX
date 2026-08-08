import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary antialiased">
      <Outlet />
    </div>
  )
}