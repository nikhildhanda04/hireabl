import { Request, Response, NextFunction } from 'express'
import { sendOtp, verifyOtp } from '../services/otp.service.js'
import { normalizePhone, isValidPhoneIndia, isValidOtp6 } from '../utils/phoneValidator.js'
import { sendSuccess, sendError } from '../utils/response.js'

export async function sendOtpController(req: Request, res: Response, next: NextFunction) {
  try {
    const phone = normalizePhone(req.body?.phone)

    if (!isValidPhoneIndia(phone)) {
      return sendError(res, 400, 'Phone number must be in format +91XXXXXXXXXX')
    }

    const result = await sendOtp(phone)

    return sendSuccess(res, 200, 'OTP sent successfully', { status: result.status })
  } catch (err) {
    next(err)
  }
}

export async function verifyOtpController(req: Request, res: Response, next: NextFunction) {
  try {
    const phone = normalizePhone(req.body?.phone)
    const otp = String(req.body?.otp || '').trim()

    if (!isValidPhoneIndia(phone)) {
      return sendError(res, 400, 'Phone number must be in format +91XXXXXXXXXX')
    }

    if (!isValidOtp6(otp)) {
      return sendError(res, 400, 'OTP must be 6 digits')
    }

    const result = await verifyOtp(phone, otp)

    if (!result.approved) {
      return sendError(res, 400, 'Invalid OTP', { status: result.status })
    }

    return sendSuccess(res, 200, 'OTP verified successfully')
  } catch (err) {
    next(err)
  }
}