import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const OTP_LENGTH = 6
const PHONE_REGEX = /^\+91\d{10}$/
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5051'

/** Digits only → +91 + last 10 digits (handles paste of 8866349970 or 918866349970) */
function toIndiaE164(raw) {
  const d = String(raw || '').replace(/\D/g, '')
  let rest = d.startsWith('91') ? d.slice(2) : d
  rest = rest.slice(0, 10)
  return rest.length === 10 ? `+91${rest}` : ''
}

function VerifyOtpPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [phone, setPhone] = useState('+91')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const [phoneError, setPhoneError] = useState('')
  const [otpError, setOtpError] = useState('')

  useEffect(() => {
    if (searchParams.get('social') === 'success') {
      // Delay ensures ToastContainer is fully mounted before triggering
      const timer = setTimeout(() => {
        toast.success('Social signup successful! Please verify your phone number.')

        // Clear param so it doesn't trigger again on reload
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('social')
        navigate({ search: newParams.toString() }, { replace: true })
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [searchParams, navigate])

  // 🔹 SEND OTP
  const handleSendOtp = async () => {
    const normalized = toIndiaE164(phone)
    if (!normalized) {
      setPhoneError('Enter a valid 10-digit Indian mobile number')
      return
    }
    setPhone(normalized)

    if (!PHONE_REGEX.test(normalized)) {
      setPhoneError('Phone number must be in format +91XXXXXXXXXX')
      return
    }

    console.log('Send OTP clicked:', { phone: normalized })

    try {
      setSendingOtp(true)
      setPhoneError('')

      const res = await fetch(`${BACKEND_URL}/api/v1/auth/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: normalized }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      setOtpSent(true)
      setOtp('')
      setOtpError('')
    } catch (err) {
      setPhoneError(err.message || 'Failed to send OTP')
    } finally {
      setSendingOtp(false)
    }
  }

  // 🔹 RESEND OTP
  const handleResendOtp = () => {
    handleSendOtp()
  }

  // 🔹 VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError('OTP is required')
      return
    }

    if (otp.trim().length !== OTP_LENGTH) {
      setOtpError(`OTP must be ${OTP_LENGTH} digits`)
      return
    }

    const phoneForVerify = toIndiaE164(phone) || phone.trim()
    console.log('Verify OTP clicked:', { phone: phoneForVerify, otp })

    try {
      setVerifying(true)
      setOtpError('')

      const res = await fetch(`${BACKEND_URL}/api/v1/auth/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneForVerify, otp }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message)

      // ✅ success → show toast and go next
      toast.success('Phone number verified successfully!')
      navigate('/dashboard')
    } catch (err) {
      setOtpError(err.message || 'Invalid OTP')
    } finally {
      setVerifying(false)
    }
  }

  // 🔹 INPUT HANDLERS
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '')
    const after91 = digits.startsWith('91') ? digits.slice(2) : digits
    setPhone(`+91${after91.slice(0, 10)}`)
    if (phoneError) setPhoneError('')
  }

  const handleOtpChange = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH)
    setOtp(digits)
    if (otpError) setOtpError('')
  }

  return (
    <main className="screen-wrap">
      <div className="auth-shell auth-shell--otp">
        <section className="flow-card flow-card--otp">
          <h1>Verify your phone</h1>
          <p className="subtext">
            We will send a one-time code to confirm your number.
          </p>

          {/* PHONE INPUT */}
          {!otpSent ? (
            <div className="otp-form-section">
              <label className="otp-label">Phone number</label>

              <input
                className="otp-input"
                type="tel"
                placeholder="+91XXXXXXXXXX"
                value={phone}
                onChange={handlePhoneChange}
                disabled={sendingOtp}
              />

              {phoneError && (
                <p className="form-error">{phoneError}</p>
              )}

              <button
                className="signup-continue-btn otp-action-btn"
                onClick={handleSendOtp}
                disabled={sendingOtp}
              >
                {sendingOtp ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          ) : (
            /* OTP SECTION */
            <div className="otp-form-section">
              <div style={{ marginBottom: '1rem', fontSize: '0.95rem', color: '#555' }}>
                Code sent to <strong>{phone}</strong>{' '}
                <button
                  onClick={() => { setOtpSent(false); setOtp(''); setOtpError(''); }}
                  style={{ background: 'none', border: 'none', color: '#0A66C2', cursor: 'pointer', textDecoration: 'underline', padding: '0 4px', fontSize: '0.9rem' }}
                >
                  Edit
                </button>
              </div>

              <label className="otp-label">
                Enter OTP (6 digits only)
              </label>

              <input
                className="otp-input otp-input--code"
                type="text"
                placeholder="••••••"
                maxLength={OTP_LENGTH}
                value={otp}
                onChange={handleOtpChange}
                disabled={verifying}
              />

              {otpError && (
                <p className="form-error">{otpError}</p>
              )}

              <button
                className="signup-continue-btn otp-action-btn"
                onClick={handleVerifyOtp}
                disabled={
                  verifying || otp.length !== OTP_LENGTH
                }
              >
                {verifying ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                className="otp-resend-btn"
                onClick={handleResendOtp}
                disabled={sendingOtp || verifying}
              >
                Resend OTP
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default VerifyOtpPage