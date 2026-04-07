import { Navigate } from 'react-router-dom'
import { useSignup } from '../context/SignupContext'

function DashboardPage() {
  const { selectedRole } = useSignup()

  if (!selectedRole) {
    return <Navigate to="/signup" replace />
  }

  return (
    <main className="screen-wrap">
      <section className="flow-card dashboard-card">
        <p className="eyebrow">Welcome</p>
        <h1>Dashboard</h1>
        <p className="subtext">
          Signup complete for <strong>{selectedRole}</strong>.
        </p>
      </section>
    </main>
  )
}

export default DashboardPage
