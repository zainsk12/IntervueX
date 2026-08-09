# IntervueX Backend

Status: **Phase 1 — Backend Foundation**. The server runs and exposes the
official route shapes, but the interview logic itself is not implemented
yet (`/api/interview` returns a placeholder response). See `docs/technical-spec.md`
at the repo root for the target contract.

## Prerequisites

- Node.js 18+ (developed against Node 22)
- npm

## Installation

```bash
cd backend
npm install
```

## Environment variables

Copy the example file and adjust as needed:

```bash
cp .env.example .env
```

| Variable        | Required in Phase 1? | Purpose                                      |
|-----------------|-----------------------|-----------------------------------------------|
| `PORT`          | No (defaults to 4000) | Port the server listens on                    |
| `NODE_ENV`      | No                     | `development` / `production`                  |
| `CORS_ORIGIN`   | No (defaults to the Vite dev origin) | Allowed origin for the frontend |
| `GROQ_API_KEY`  | No — used from the LLM Provider Integration phase onward | Primary LLM provider |
| `MISTRAL_API_KEY` | No — used from the LLM Provider Integration phase onward | Fallback LLM provider |

## Development

```bash
npm run dev
```

Starts the server with hot reload at `http://localhost:4000`.

## Type checking / build / production

```bash
npm run typecheck   # tsc --noEmit
npm run build        # compiles to dist/
npm start            # runs the compiled server (dist/src/server.js)
```

## Tests

```bash
npm test
```

## Endpoints

### `GET /health`

Local development check.

```json
{ "status": "ok" }
```

### `POST /api/interview`

Official contract (see `docs/technical-spec.md`). Phase 1 validates the
request shape and returns a structurally-correct placeholder — no session
state, curriculum/candidate logic, or LLM calls yet.

**Start a session:**

```json
{ "sessionId": "abc-123", "candidate": { "...": "..." } }
```

**Continue a session:**

```json
{ "sessionId": "abc-123", "message": "..." }
```

**Response shape (Phase 1 — always `done: false`):**

```json
{ "reply": "...", "done": false }
```

Malformed requests (missing `sessionId`, missing both `candidate` and
`message`, invalid JSON) return `400` with an `{ "error": "..." }` body
instead of crashing the server.
