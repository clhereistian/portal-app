import type { PortalSite } from '@/types'
import SignOutButton from '@/components/SignOutButton'

interface PortalSitesListProps {
  portalSites: PortalSite[]
}

const PortalSitesList = ({ portalSites }: PortalSitesListProps) => {
  return (
    <>
      <p className="hint">Choose an app to continue.</p>
      <div className="list">
        {portalSites.map((site) => (
          <button
            key={site.key}
            className="link"
            onClick={() => window.location.assign(site.url ?? '')}
          >
            {site.label}
          </button>
        ))}
      </div>
      <SignOutButton />
    </>
  )
}

export default PortalSitesList
