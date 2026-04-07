/**
 * routes/auth.js
 * ---------------
 * Thin router — only defines OAuth endpoints.
 * Zero business logic here; Passport middleware + controller handle everything.
 *
 * Mounted at: /api/v1/auth  (in server.js)
 * Full paths:
 *   GET /api/v1/auth/google                → start Google OAuth flow
 *   GET /api/v1/auth/google/callback       → Google OAuth callback
 *   GET /api/v1/auth/microsoft             → start Microsoft OAuth flow
 *   GET /api/v1/auth/microsoft/callback    → Microsoft OAuth callback
 *   GET /api/v1/auth/oauth-debug           → show configured redirect URIs
 */

import express  from 'express'
import passport from 'passport'
import {
  googleCallbackController,
  microsoftCallbackController,
  oauthDebugController,
} from '../controllers/auth.controller.js'

const router = express.Router()

// ── Debug ─────────────────────────────────────────────────────────────────────
router.get('/oauth-debug', oauthDebugController)

// ── Google OAuth ──────────────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
)

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  googleCallbackController,
)

// ── Microsoft OAuth ───────────────────────────────────────────────────────────
router.get('/microsoft',
  passport.authenticate('microsoft', { prompt: 'select_account' }),
)

router.get('/microsoft/callback',
  passport.authenticate('microsoft', { failureRedirect: '/' }),
  microsoftCallbackController,
)

export default router