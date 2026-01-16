import { useEffect } from 'react'
import '@/App.css'
import { InteractionStatus, type AccountInfo } from '@azure/msal-browser'
import { useIsAuthenticated, useMsal } from '@azure/msal-react'
import type { PortalSite } from '@/types'
import SignInButton from '@/components/SignInButton'
import NoSites from '@/components/NoSites'
import PortalSitesList from './components/PortalSitesList'

const buildUrl = (baseUrl?: string, loginHint?: string) => {
  if (!baseUrl) return undefined

  const params = new URLSearchParams({ autoLogin: '1' })
  if (loginHint) params.set('loginHint', loginHint)

  return `${baseUrl}?${params.toString()}`
}

const getRolesFromToken = (account: AccountInfo) => account?.idTokenClaims?.roles ?? []

const canAccessSite = (site: PortalSite, roles: string[]) =>
  roles.includes(site.key) && site.url

const buildPortalSites = (loginHint: string, roles: string[]): PortalSite[] => {
  const customerPortalUrl = import.meta.env.VITE_APP_CUSTOMER_PORTAL_URL
  const customerPortalRole = import.meta.env.VITE_APP_CUSTOMER_PORTAL_ROLE
  const orderPortalUrl = import.meta.env.VITE_APP_ORDER_PORTAL_URL
  const orderPortalRole = import.meta.env.VITE_APP_ORDER_PORTAL_ROLE

  const allSites = [
    {
      key: customerPortalRole,
      label: 'Customer Portal',
      url: buildUrl(customerPortalUrl, loginHint)
    },
    {
      key: orderPortalRole,
      label: 'Order Portal',
      url: buildUrl(orderPortalUrl, loginHint)
    }
  ]

  return allSites.filter((site) => canAccessSite(site, roles))
}

const shouldAutoRedirect = (
  portalSites: PortalSite[],
  isAuthenticated: boolean,
  inProgress: InteractionStatus
): boolean =>
  isAuthenticated &&
  inProgress === InteractionStatus.None &&
  portalSites.length === 1 &&
  portalSites[0]?.url != null &&
  portalSites[0]?.url.length > 0

const App = () => {
  const { instance, accounts, inProgress } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const activeAccount = instance.getActiveAccount() ?? accounts[0] ?? null
  const loginHint = activeAccount?.username

  const roles = getRolesFromToken(activeAccount)
  const portalSites = buildPortalSites(loginHint, roles)

  useEffect(() => {
    if (
      shouldAutoRedirect(portalSites, isAuthenticated, inProgress) &&
      portalSites[0].url
    )
      window.location.assign(portalSites[0].url)
  }, [inProgress, isAuthenticated, portalSites])

  return (
    <div className="page">
      <div className="card">
        <h1 className="text-2xl font-bold">AGI Portal Hub</h1>
        {!isAuthenticated ? (
          <SignInButton />
        ) : portalSites.length === 0 ? (
          <NoSites />
        ) : (
          <PortalSitesList portalSites={portalSites} />
        )}
        {isAuthenticated && activeAccount ? (
          <p className="meta">Signed in as {activeAccount.username}</p>
        ) : null}
      </div>
    </div>
  )
}

export default App
