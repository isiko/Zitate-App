import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        <button type="button" class="btn btn-danger" onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      <button type="button" class="btn btn-primary" onClick={() => signIn()}>Sign in</button>
    </>
  )
}
