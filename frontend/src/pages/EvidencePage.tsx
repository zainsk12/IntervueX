import { useParams } from 'react-router-dom'
import { PlaceholderPage } from '../components/PlaceholderPage'
import { ROUTES } from '../data/routes'

export default function EvidencePage() {
  const { evidenceId } = useParams<{ evidenceId?: string }>()

  return (
    <PlaceholderPage
      title="Dynamic Evidence"
      description="Explore evidence records and how they shaped the candidate assessment."
      path={evidenceId ? `${ROUTES.EVIDENCE}/${evidenceId}` : ROUTES.EVIDENCE}
      detail={
        evidenceId
          ? `Evidence ID: ${evidenceId}`
          : 'Optional route parameter: /evidence/:evidenceId'
      }
    />
  )
}
