import { InteractionStatus } from '@azure/msal-browser'
import { useMsal } from '@azure/msal-react'

const SignOutButton = () => {
  const { instance, inProgress } = useMsal()

  const handleSignOut = () => instance.logoutRedirect({ postLogoutRedirectUri: '/' })

  return (
    <button
      className="secondary"
      onClick={handleSignOut}
      disabled={inProgress !== InteractionStatus.None}
    >
      Sign out
    </button>
  )
}

export default SignOutButton
