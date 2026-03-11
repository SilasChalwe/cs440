import { useEffect, useMemo, useState } from 'react'
import { Table } from '../../components/Table'
import { systemService } from '../../services'
import type { AllowanceRecord, SessionUser, StudentDashboardData } from '../../types/domain'
import { formatCurrency, formatDate, maskAccount } from '../../utils/format'

interface StudentPortalProps {
  user: SessionUser
  onLogout: () => Promise<void>
}

export function StudentPortal({ user, onLogout }: StudentPortalProps) {
  const [data, setData] = useState<StudentDashboardData | null>(null)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [view, setView] = useState<'dashboard' | 'profile'>('dashboard')
  const locale = navigator.language || 'en-US'

  useEffect(() => {
    async function load() {
      try {
        setError('')
        const payload = await systemService.getStudentDashboard(user.id)
        setData(payload)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to load student dashboard'
        setError(message)
      }
    }

    void load()
  }, [user.id])

  const allowanceTotal = useMemo(() => {
    if (!data) return 0
    return data.allowances.reduce((sum, allowance) => sum + allowance.amount, 0)
  }, [data])

  const currentBalance = useMemo(() => {
    if (!data) return 0
    return allowanceTotal
  }, [allowanceTotal, data])

  return (
    <div className="student-shell">
      <aside className={sidebarOpen ? 'student-sidebar is-open' : 'student-sidebar'} aria-label="Student navigation">
        <div className="sidebar-header">
          {/* <p className="sidebar-label">Secure Session</p> */}
          <h2>Dashboard</h2>
          <p className="sidebar-subtitle">{data?.student.fullName || 'Student'}</p>
          {/* <p className="sidebar-subtitle">{data?.student.loanLimit || 'username'}</p> */}
        </div>

        {/* <div className="sidebar-section">
          <p className="identity-label">Student ID</p>
          <p className="identity-value">{user.id}</p>
        </div> */}

      

        <button
          className="ghost-button sidebar-link"
          type="button"
          onClick={() => {
            setView('dashboard')
            setSidebarOpen(false)
          }}
        >
          Home
        </button>
        <button
          className="ghost-button sidebar-link"
          type="button"
          onClick={() => {
            setView('profile')
            setSidebarOpen(false)
          }}
        >
          Profile
        </button>

       

        <button className="ghost-button sidebar-logout" type="button" onClick={() => void onLogout()}>
          Logout
        </button>
           <div className="sidebar-section">
          <p className="identity-label">Assigned Bank</p>
          <p className="identity-value">
            {data
              ? data.student.bankName || (data.student.bankId ? `Bank ${data.student.bankId}` : 'Assigned Bank')
              : '...'}
          </p>
        </div>
      </aside>
      {sidebarOpen ? (
        <div
          className="sidebar-backdrop"
          role="presentation"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <main className="student-main">
        <header className="student-topbar">
          <button
            className="hamburger"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="topbar-text">
            <p className="text-muted">{view === 'profile' ? 'Profile' : 'Dashboard'}</p>
            <h1>{data ? data.student.fullName : 'Student Portal'}</h1>
          </div>
        </header>

        {data ? (
          <div className="layout-grid">
            {view === 'profile' ? (
              <section className="content-card student-profile">
                <div className="profile-header">
                  <div>
                    <p className="text-muted">Student</p>
                    <h2>{data.student.fullName}</h2>
                  </div>
                  <div className="profile-id">Student ID: {user.id}</div>
                </div>

                <div className="profile-grid">
                  <div className="profile-field">
                    <label>Email</label>
                    <div>{data.student.email}</div>
                  </div>
                  <div className="profile-field">
                    <label>Phone</label>
                    <div>{data.student.phone}</div>
                  </div>
                  <div className="profile-field">
                    <label>Bank Account</label>
                    <div>{maskAccount(data.student.accountNumber)}</div>
                  </div>
                  <div className="profile-field">
                    <label>Assigned Bank</label>
                    <div>
                      {data.student.bankName ||
                        (data.student.bankId ? `Bank ${data.student.bankId}` : 'Assigned Bank')}
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="content-card">
                <h2>Financial Overview</h2>
                <div className="financial-summary">
                  <div>
                    <p className="text-muted">Current Balance</p>
                    <p className="summary-value">{formatCurrency(currentBalance, locale)}</p>
                  </div>
                  <div>
                    <p className="text-muted">Interest Rate</p>
                    <p className="summary-value">{data.student.loan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted">Next Allowance</p>
                    <p className="summary-value">
                      {formatCurrency(data.student.nextAllowanceAmount, locale)} on{' '}
                      {formatDate(data.student.nextAllowanceDate, locale)}
                    </p>
                  </div>
                </div>

                <h3>Allowance History</h3>
                <Table
                  rows={data.allowances}
                  emptyMessage="No allowance records available"
                  columns={[
                    { key: 'date', header: 'Date', render: (row: AllowanceRecord) => formatDate(row.date, locale) },
                    {
                      key: 'amount',
                      header: 'Amount (ZMW)',
                      render: (row: AllowanceRecord) => formatCurrency(row.amount, locale),
                    },
                    { key: 'status', header: 'Status', render: (row: AllowanceRecord) => row.status },
                  ]}
                />
              </section>
            )}
          </div>
        ) : (
          <p>Loading student dashboard...</p>
        )}

        {error ? <p className="error-text">{error}</p> : null}
      </main>
    </div>
  )
}
