import dotenv from 'dotenv'
dotenv.config()

import express, { Application } from 'express'
import cors from 'cors'
import session from 'express-session'
import passport from 'passport'

import { initPassport } from './services/passport.service.js'
import authRoutes from './routes/auth.js'
import otpRoutes from './routes/otp.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const PORT = process.env.PORT || 5051
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

const app: Application = express()

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}))

app.use(express.json())

app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}))

app.use(passport.initialize())
app.use(passport.session())

initPassport(passport)

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/auth', otpRoutes)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})