import { PlaceholderPage } from '../components/PlaceholderPage'
import { ROUTES } from '../data/routes'

export default function CandidateSetupPage() {
  return (
    <PlaceholderPage
      title="Candidate Setup"
      description="Collect candidate context and prepare the initial competency hypotheses."
      path={ROUTES.INTERVIEW_SETUP}
    />
  )
}
