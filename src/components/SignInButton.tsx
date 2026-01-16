import { InteractionStatus } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '@/auth/authConfig'

const SignInButton = () => {
  const { instance } = useMsal()
  const { inProgress } = useMsal()

  return (
    <>
      <p className="hint">Sign in to see your apps.</p>
      <button
        onClick={() => instance.loginRedirect(loginRequest)}
        disabled={inProgress !== InteractionStatus.None}
      >
        Sign in
      </button>
    </>
  )
}

export default SignInButton
