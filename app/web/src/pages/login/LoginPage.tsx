import { useMemo, useState } from 'react'
import { GlassEffectLogin } from './GlassEffectLogin'
import { sanitizeIdentifier, sanitizeText } from '../../utils/security'

interface LoginPageProps {
  loading: boolean
  error: string
  timedOut: boolean
  onLogin: (payload: { username: string; password: string }) => Promise<void>
}

export function LoginPage({ loading, error, timedOut, onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const canSubmit = username.trim().length >= 3 && password.trim().length >= 4
  const safeError = useMemo(() => {
    if (!error) {
      return ''
    }

    if (error.includes('timed out')) {
      return error
    }

    return 'Login failed. Verify username and password, then try again.'
  }, [error])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) {
      return
    }

    await onLogin({
      username: sanitizeIdentifier(username, 48),
      password: sanitizeText(password, 72),
    })
  }

  return (
    <GlassEffectLogin
      loading={loading}
      timedOut={timedOut}
      errorMessage={safeError}
      username={username}
      password={password}
      canSubmit={canSubmit}
      onSubmit={handleSubmit}
      onUsernameChange={(event) => setUsername(event.target.value)}
      onPasswordChange={(event) => setPassword(event.target.value)}
    />
  )
}
