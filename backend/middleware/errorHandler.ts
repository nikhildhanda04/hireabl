import { Request, Response, NextFunction } from 'express'

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[errorHandler]', err)

  const statusCode = err.statusCode || err.status || 500
  const message    = err.message    || 'Internal Server Error'

  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  })
}