import { createContext, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'hirabl_signup_role'

const SignupContext = createContext(null)

function readStoredRole() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

export function SignupProvider({ children }) {
  const [selectedRole, setSelectedRoleState] = useState(readStoredRole)

  const setSelectedRole = (role) => {
    setSelectedRoleState(role)
    try {
      if (role) sessionStorage.setItem(STORAGE_KEY, role)
      else sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }

  const value = useMemo(
    () => ({
      selectedRole,
      setSelectedRole,
    }),
    [selectedRole],
  )

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
}

export function useSignup() {
  const context = useContext(SignupContext)

  if (!context) {
    throw new Error('useSignup must be used within SignupProvider')
  }

  return context
}
