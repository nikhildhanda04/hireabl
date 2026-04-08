import twilio from 'twilio'

// ── Env validation (fail fast at startup, not mid-request) ────
const _accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID
const _authToken  = process.env.TWILIO_AUTH_TOKEN
const _serviceSid = process.env.TWILIO_SERVICE_SID

if (!_accountSid) throw new Error('Missing TWILIO_ACCOUNT_SID (or TWILIO_SID)')
if (!_authToken)  throw new Error('Missing TWILIO_AUTH_TOKEN')
if (!_serviceSid) throw new Error('Missing TWILIO_SERVICE_SID')

// After the guards above, all three are guaranteed to be strings
const accountSid: string = _accountSid
const authToken: string  = _authToken
const serviceSid: string = _serviceSid

// ── Single Twilio client instance (reused across all requests) ─
const client = twilio(accountSid, authToken)

// ── Service functions ─────────────────────────────────────────

export async function sendOtp(phone: string) {
  const verification = await client.verify.v2
    .services(serviceSid)
    .verifications.create({
      to: phone,
      channel: 'sms',
    })

  return { status: verification.status }
}

export async function verifyOtp(phone: string, code: string) {
  const check = await client.verify.v2
    .services(serviceSid)
    .verificationChecks.create({
      to: phone,
      code,
    })

  return {
    approved: check.status === 'approved',
    status: check.status,
  }
}