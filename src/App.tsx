import { useEffect, useMemo } from 'react'
import './App.css'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import { loginRequest } from './auth/authConfig'

function App() {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const activeAccount = instance.getActiveAccount() ?? accounts[0] ?? null

  const todoAppUrl = import.meta.env.VITE_TODO_APP_URL as string | undefined
  const authCheckUrl = import.meta.env.VITE_AUTH_CHECK_URL as string | undefined

  const roles = useMemo(() => {
    const claims = activeAccount?.idTokenClaims as { roles?: string[] } | undefined
    return claims?.roles ?? []
  }, [activeAccount])

  const options = useMemo(() => {
    const loginHint = activeAccount?.username
    const buildUrl = (baseUrl?: string) => {
      if (!baseUrl) {
        return undefined
      }
      const params = new URLSearchParams({ autoLogin: '1' })
      if (loginHint) {
        params.set('loginHint', loginHint)
      }
      return `${baseUrl}?${params.toString()}`
    }
    return [
      { key: 'TodoApp', label: 'To-Do App', url: buildUrl(todoAppUrl) },
      { key: 'AuthCheckApp', label: 'Auth Check', url: buildUrl(authCheckUrl) },
    ].filter((item) => roles.includes(item.key) && item.url)
  }, [activeAccount, authCheckUrl, roles, todoAppUrl])

  useEffect(() => {
    if (isAuthenticated && options.length === 1 && options[0].url) {
      window.location.assign(options[0].url)
    }
  }, [isAuthenticated, options])

  return (
    <div className="page">
      <div className="card">
        <h1>Portal</h1>
        {!isAuthenticated ? (
          <>
            <p className="hint">Sign in to see your apps.</p>
            <button onClick={() => instance.loginRedirect(loginRequest)}>
              Sign in
            </button>
          </>
        ) : options.length === 0 ? (
          <>
            <p className="hint">No apps assigned to your account.</p>
            <button
              className="secondary"
              onClick={() =>
                instance.logoutRedirect({ postLogoutRedirectUri: '/' })
              }
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <p className="hint">
              Choose an app to continue.
            </p>
            <div className="list">
              {options.map((option) => (
                <button
                  key={option.key}
                  className="link"
                  onClick={() => window.location.assign(option.url as string)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              className="secondary"
              onClick={() =>
                instance.logoutRedirect({ postLogoutRedirectUri: '/' })
              }
            >
              Sign out
            </button>
          </>
        )}
        {isAuthenticated && activeAccount ? (
          <p className="meta">Signed in as {activeAccount.username}</p>
        ) : null}
      </div>
    </div>
  )
}

export default App
