import { Link } from 'react-router-dom'
import { useSignup } from '../context/SignupContext'

const ROLE_LABEL = { employee: 'Employee', employer: 'Employer' }

function ProfilePage() {
  const { selectedRole } = useSignup()
  const roleLabel = ROLE_LABEL[selectedRole] || selectedRole

  return (
    <main className="screen-wrap">
      <section className="flow-card dashboard-card">
        <h1>Profile</h1>
        <p className="subtext">
          {roleLabel ? (
            <>
              Signed up as <strong>{roleLabel}</strong>.
            </>
          ) : (
            'Welcome.'
          )}{' '}
          Add your phone number anytime to verify your mobile.
        </p>
        <p className="subtext" style={{ marginTop: 16 }}>
          <Link to="/verify-otp" style={{ color: '#111827', fontWeight: 600 }}>
            Verify phone number (OTP)
          </Link>
        </p>
      </section>
    </main>
  )
}

export default ProfilePage
