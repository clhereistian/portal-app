import SignOutButton from '@/components/SignOutButton'

const NoSites = () => {
  return (
    <>
      <p className="hint">No apps assigned to your account.</p>
      <SignOutButton />
    </>
  )
}

export default NoSites
