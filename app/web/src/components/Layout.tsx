import type { PropsWithChildren, ReactNode } from 'react'

interface LayoutProps extends PropsWithChildren {
  title: string
  subtitle?: string
  actions?: ReactNode
  nav?: ReactNode
}

export function Layout({ title, subtitle, actions, nav, children }: LayoutProps) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="shell-header">
        <div className="shell-title-wrap">
          <p className="security-chip">Secure Session</p>
          <h1>{title}</h1>
          {subtitle ? <p className="shell-subtitle">{subtitle}</p> : null}
        </div>
        <div className="header-actions">{actions}</div>
        {nav ? <div className="header-nav">{nav}</div> : null}
      </header>
      <main id="main-content">{children}</main>
    </div>
  )
}
