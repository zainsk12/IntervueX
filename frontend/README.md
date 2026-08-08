# IntervueX — Frontend

React + TypeScript + Vite frontend for IntervueX, an adaptive technical interview platform. See
the repository-root `README.md` for overall project context and `../docs/FRONTEND_DESIGN_SPEC.md`
for the visual design system ("Evidence Chamber").

## Scripts

```bash
npm install       # install dependencies
npm run dev        # start the Vite dev server
npm run build       # type-check (tsc -b) and produce a production build in dist/
npm run lint        # run ESLint
npm run preview      # preview the production build locally
```

## Routes

| Path                     | Page                     | Purpose                                             |
| ------------------------ | ------------------------ | ---------------------------------------------------- |
| `/`                        | Landing Page               | Product entry point and interview initiation.         |
| `/interview/setup`          | Candidate Setup             | Candidate profile, role context, and session config.  |
| `/interview`                | Interview Workspace          | The adaptive interview itself (question → response → evidence). |
| `/results`                 | Results / Assessment          | Evidence-backed assessment summary.                   |
| `/evidence`, `/evidence/:evidenceId` | Evidence System | Full evidence log and individual evidence records.      |

Route paths are centralized in `src/data/routes.ts` (`ROUTES`) — the app never hardcodes a path
string elsewhere; all navigation goes through this constant.

## Architecture notes

- **State & persistence:** there is no backend call in this build. Candidate setup and the
  in-progress evidence log are held in React state and mirrored to `sessionStorage`
  (`src/lib/interviewSession.ts`) so the Evidence System and Results pages — separate routes — can
  read the current session after the Interview Workspace unmounts.
- **Interview questions:** selected from a static local bank (`src/data/interviewQuestions.ts`) by
  `src/lib/buildInterviewQueue.ts`, filtered by the candidate's chosen focus areas. This is a
  deterministic, frontend-only stand-in for real adaptive question selection — see
  `docs/technical-spec.md` for the intended backend contract.
- **Assessment:** `src/lib/resultsAssessment.ts` derives an evidence-*coverage* summary (what was
  captured vs. not) from the session's evidence log. There is no response-quality scoring model in
  this frontend build — the Results page presents evidence for a human reviewer to interpret, not
  a computed verdict.
- **Design tokens:** all colors, spacing, and typography are defined as CSS variables in
  `src/index.css` (`@theme`) and consumed via Tailwind utility classes — no ad hoc hex values in
  components.
- **Folder structure:** `pages/` holds one component per route; `components/` is organized by the
  page/feature it belongs to (`interview/`, `interview-setup/`, `evidence/`, `results/`,
  `landing/`), plus a small set of shared, cross-page components at the `components/` root (e.g.
  `SectionLabel.tsx`).

## Tech stack

React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7, Framer Motion, lucide-react.