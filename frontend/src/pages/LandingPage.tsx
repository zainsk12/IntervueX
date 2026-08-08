import { PlaceholderPage } from '../components/PlaceholderPage'
import { ROUTES } from '../data/routes'

export default function LandingPage() {
  return (
    <PlaceholderPage
      title="Landing"
      description="Product entry point for starting an evidence-driven technical interview."
      path={ROUTES.LANDING}
    />
  )
}
