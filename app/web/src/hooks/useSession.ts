import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { LoginInput, SessionUser } from '../types/domain'
import { systemService } from '../services'

const SESSION_TIMEOUT_MS = 20 * 60 * 1000
const SESSION_STORAGE_KEY = 'sls_session_user'
const TOKEN_STORAGE_KEY = 'sls_token'
const SESSION_EXPIRED_EVENT = 'sls:session-expired'

interface UseSessionResult {
  user: SessionUser | null
  loading: boolean
  error: string
  timedOut: boolean
  login: (input: LoginInput) => Promise<void>
  logout: () => Promise<void>
}

function readStoredSession(): SessionUser | null {
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) {
      return null
    }
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

function readStoredToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

function parseJwtPayload(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1]
    if (!payload) {
      return {}
    }

    const normalized = payload.replaceAll('-', '+').replaceAll('_', '/')
    const padding = '='.repeat((4 - (normalized.length % 4)) % 4)
    const decoded = atob(normalized + padding)
    return JSON.parse(decoded) as Record<string, unknown>
  } catch {
    return {}
  }
}

export function useSession(): UseSessionResult {
  const [user, setUser] = useState<SessionUser | null>(() => readStoredSession())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timedOut, setTimedOut] = useState(false)
  const timeoutRef = useRef<number | null>(null)
  const tokenTimeoutRef = useRef<number | null>(null)

  const persistUser = (value: SessionUser | null): void => {
    if (value) {
      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(value))
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY)
    }
  }

  const clearTimer = useCallback((): void => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const clearTokenTimer = useCallback((): void => {
    if (tokenTimeoutRef.current !== null) {
      window.clearTimeout(tokenTimeoutRef.current)
      tokenTimeoutRef.current = null
    }
  }, [])

  const clearSession = useCallback(() => {
    clearTimer()
    clearTokenTimer()
    persistUser(null)
    setUser(null)
  }, [clearTimer, clearTokenTimer])

  const forceLogout = useCallback(async () => {
    if (user) {
      await systemService.logLogout(user.id)
    }
    clearSession()
  }, [clearSession, user])

  const resetTimer = useCallback(() => {
    if (!user) {
      return
    }

    clearTimer()
    timeoutRef.current = window.setTimeout(async () => {
      setTimedOut(true)
      await forceLogout()
    }, SESSION_TIMEOUT_MS)
  }, [clearTimer, forceLogout, user])

  const scheduleTokenExpiry = useCallback(() => {
    if (!user) {
      return
    }

    clearTokenTimer()
    const token = readStoredToken()
    if (!token) {
      return
    }

    const claims = parseJwtPayload(token)
    const expSeconds = Number(claims.exp)
    if (!Number.isFinite(expSeconds) || expSeconds <= 0) {
      return
    }

    const expiresAt = expSeconds * 1000
    const delayMs = expiresAt - Date.now()

    if (delayMs <= 0) {
      setTimedOut(true)
      clearSession()
      return
    }

    tokenTimeoutRef.current = window.setTimeout(() => {
      setTimedOut(true)
      clearSession()
    }, delayMs)
  }, [clearSession, clearTokenTimer, user])

  useEffect(() => {
    if (!user) {
      return undefined
    }

    resetTimer()
    scheduleTokenExpiry()

    const events: Array<keyof WindowEventMap> = ['click', 'keydown', 'mousemove', 'touchstart']
    const handler = (): void => resetTimer()

    events.forEach((event) => {
      window.addEventListener(event, handler)
    })

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handler)
      })
      clearTimer()
      clearTokenTimer()
    }
  }, [clearTokenTimer, resetTimer, scheduleTokenExpiry, user])

  useEffect(() => {
    const handleSessionExpired = (): void => {
      setTimedOut(true)
      clearSession()
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    }
  }, [clearSession])

  const login = useCallback(async (input: LoginInput) => {
    setLoading(true)
    setError('')
    setTimedOut(false)

    try {
      const sessionUser = await systemService.login(input)
      persistUser(sessionUser)
      setUser(sessionUser)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to sign in'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      if (user) {
        await systemService.logLogout(user.id)
      }
      clearSession()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to logout'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [user])

  return useMemo(
    () => ({
      user,
      loading,
      error,
      timedOut,
      login,
      logout,
    }),
    [user, loading, error, timedOut, login, logout],
  )
}
