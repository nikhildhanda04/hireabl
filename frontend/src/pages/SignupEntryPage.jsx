import { useState } from 'react'
import RoleCard from '../components/RoleCard'
import SocialButton from '../components/SocialButton'
import { useSignup } from '../context/SignupContext'

const PROVIDERS = ['Google', 'Microsoft', 'Yahoo']
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:5051'

function SignupEntryPage() {
  const { setSelectedRole } = useSignup()
  const [showSocial, setShowSocial] = useState(false)
  const [role, setRole] = useState('')
  const [activeProvider, setActiveProvider] = useState('')

  const handleContinue = () => {
    if (!role) return
    setSelectedRole(role)
    setShowSocial(true)
  }

  const handleSocialSignup = (provider) => {
    if (provider === 'Google') {
      // setSelectedRole writes sessionStorage so role survives OAuth redirect
      setSelectedRole(role)
      window.location.href = `${BACKEND_URL}/api/v1/auth/google`
      return
    }
    if (provider === 'Microsoft') {
      setSelectedRole(role)
      window.location.href = `${BACKEND_URL}/api/v1/auth/microsoft`
      return
    }

    // Yahoo: UI only
    alert('Coming soon')
  }

  return (
    <main className="screen-wrap">
      <div className="auth-shell">
        <section className="flow-card flow-card--signup">
          <h1>Create your account</h1>
          <p className="subtext">
            Choose how you want to sign up and continue.
          </p>

          <div className="role-grid">
            <RoleCard
              title="Sign up as Employee"
              selected={role === 'employee'}
              onClick={() => setRole('employee')}
            />
            <RoleCard
              title="Sign up as Employer"
              selected={role === 'employer'}
              onClick={() => setRole('employer')}
            />
          </div>

          <button
            type="button"
            className="signup-continue-btn"
            disabled={!role}
            onClick={handleContinue}
          >
            Continue
          </button>

          {showSocial && (
            <div className="signup-social-section" aria-live="polite">
              <h2 className="signup-social-heading">
                Complete social signup
              </h2>
              <p className="subtext signup-social-role">
                Selected role: <strong>{role}</strong>
              </p>
              <div className="social-list">
                {PROVIDERS.map((provider) => (
                  <SocialButton
                    key={provider}
                    provider={provider}
                    onClick={() => handleSocialSignup(provider)}
                    isLoading={activeProvider === provider}
                    disabled={Boolean(activeProvider)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default SignupEntryPage
