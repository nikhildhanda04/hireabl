/**
 * services/passport.service.js
 * ----------------------------
 * Passport strategy configuration (Google OAuth & Microsoft OAuth).
 * Calling initPassport(passport) registers both strategies and the
 * serialize/deserialize hooks – exactly as before, just in its own file.
 */

import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as MicrosoftStrategy } from 'passport-microsoft'

// ── URL helpers (same logic as original auth.js) ──────────────────────────────

const BACKEND_URL = (process.env.BACKEND_URL || 'http://localhost:5051').replace(/\/$/, '')

function googleCallbackUrl() {
  const fromEnv = process.env.GOOGLE_CALLBACK_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return `${BACKEND_URL}/api/v1/auth/google/callback`
}

function microsoftCallbackUrl() {
  const fromEnv = process.env.MICROSOFT_CALLBACK_URL
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return `${BACKEND_URL}/api/v1/auth/microsoft/callback`
}

export const GOOGLE_CALLBACK_URL = googleCallbackUrl()
export const MICROSOFT_CALLBACK_URL = microsoftCallbackUrl()

// ── Debug logging (same as original) ─────────────────────────────────────────

if (process.env.GOOGLE_CLIENT_ID) {
  console.log(
    '[auth] Google OAuth — add this exact redirect URI to the OAuth client:',
    GOOGLE_CALLBACK_URL,
  )
  console.log('[auth] Client ID ends with:', process.env.GOOGLE_CLIENT_ID.slice(-24))
}

if (process.env.MICROSOFT_CLIENT_ID) {
  console.log(
    '[auth] Microsoft OAuth — add this exact redirect URI to the OAuth client:',
    MICROSOFT_CALLBACK_URL,
  )
  console.log('[auth] Client ID ends with:', process.env.MICROSOFT_CLIENT_ID.slice(-24))
}

// ── Strategy registration ─────────────────────────────────────────────────────

/**
 * Register both OAuth strategies on the provided passport instance.
 * Call this once at startup, before any routes are mounted.
 * @param {import('passport').PassportStatic} passport
 */
export function initPassport(passport) {
  // ── Google ────────────────────────────────────────────────────────────────
  passport.use(new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value ?? null
      const user = {
        id: profile.id,
        name: profile.displayName || null,
        email,
        provider: 'google',
      }
      return done(null, user)
    },
  ))

  // ── Microsoft ─────────────────────────────────────────────────────────────
  passport.use(new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackURL: MICROSOFT_CALLBACK_URL,
      scope: ['user.read'],
    },
    (accessToken, refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value ?? null
      const user = {
        id: profile.id,
        name: profile.displayName || null,
        email,
        provider: 'microsoft',
      }
      return done(null, user)
    },
  ))

  // ── Session helpers ───────────────────────────────────────────────────────
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))
}
