/**
 * routes/otp.js
 * --------------
 * Thin router — only defines OTP endpoints.
 * Zero business logic here; everything delegates to the controller.
 *
 * Mounted at: /api/v1/auth  (in server.js)
 * Full paths:
 *   POST /api/v1/auth/otp/send
 *   POST /api/v1/auth/otp/verify
 */

import express from 'express'
import { sendOtpController, verifyOtpController } from '../controllers/otp.controller.js'

const router = express.Router()

router.post('/otp/send',   sendOtpController)
router.post('/otp/verify', verifyOtpController)

export default router