import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { env } from './config/env'
import interviewRouter from './routes/interview'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.corsOrigin,
    }),
  )
  app.use(express.json())

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' })
  })

  app.use('/api/interview', interviewRouter)

  // 404 handler — no matching route.
  app.use((req: Request, res: Response) => {
    res.status(404).json({ error: `Not found: ${req.method} ${req.originalUrl}` })
  })

  // Centralized error handler — must be registered last, with 4 args so
  // Express recognizes it as an error-handling middleware.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    // Malformed JSON bodies are thrown by express.json() before reaching any
    // route handler and land here.
    console.error('[error]', err)
    const status =
      typeof err === 'object' && err !== null && 'status' in err && typeof (err as { status: unknown }).status === 'number'
        ? (err as { status: number }).status
        : 500
    res.status(status).json({ error: 'Internal server error.' })
  })

  return app
}
