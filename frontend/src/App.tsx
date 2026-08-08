import { Navigate, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import WorkspaceLayout from './layouts/WorkspaceLayout'
import { ROUTES } from './data/routes'
import LandingPage from './pages/LandingPage'
import CandidateSetupPage from './pages/CandidateSetupPage'
import InterviewWorkspacePage from './pages/InterviewWorkspacePage'
import ResultsPage from './pages/ResultsPage'
import EvidencePage from './pages/EvidencePage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.LANDING} element={<LandingPage />} />
      </Route>

      <Route element={<WorkspaceLayout />}>
        <Route path={ROUTES.INTERVIEW_SETUP} element={<CandidateSetupPage />} />
        <Route path={ROUTES.INTERVIEW} element={<InterviewWorkspacePage />} />
        <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
        <Route path={`${ROUTES.EVIDENCE}/:evidenceId?`} element={<EvidencePage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  )
}