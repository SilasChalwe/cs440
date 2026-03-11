import { useEffect, useMemo, useRef, useState } from 'react'
import { AccessDeniedModal } from '../../components/AccessDeniedModal'
import { Table } from '../../components/Table'
import { systemService } from '../../services'
import type { BankDashboardData, SessionUser, Student, StudentDashboardData } from '../../types/domain'
import { formatCurrency, formatDate } from '../../utils/format'
import { sanitizeMoney, sanitizeText } from '../../utils/security'

interface BankPortalProps {
  user: SessionUser
  onLogout: () => Promise<void>
}

export function BankPortal({ user, onLogout }: BankPortalProps) {
  const [dashboard, setDashboard] = useState<BankDashboardData | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentDashboardData | null>(null)
  const [search, setSearch] = useState('')
  const [actionAmount, setActionAmount] = useState('')
  const [warningMessage, setWarningMessage] = useState('')
  const [deniedOpen, setDeniedOpen] = useState(false)
  const [deniedDetail, setDeniedDetail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [allowanceModalOpen, setAllowanceModalOpen] = useState(false)
  const modalCloseRef = useRef<HTMLButtonElement | null>(null)
  const locale = navigator.language || 'en-US'

  useEffect(() => {
    async function load() {
      try {
        setError('')
        const data = await systemService.getBankDashboard(user.id)
        setDashboard(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load bank dashboard'
        setError(message)
      }
    }

    void load()
  }, [user.id])

  const filteredStudents = useMemo(() => {
    if (!dashboard) return []

    return dashboard.students.filter((student) => {
      const matchesSearch =
        student.fullName.toLowerCase().includes(search.toLowerCase()) ||
        student.id.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
  }, [dashboard, search])

  async function openStudent(studentId: string): Promise<boolean> {
    setLoading(true)
    setError('')

    try {
      const details = await systemService.getBankStudentDetails(user.id, studentId)
      setSelectedStudent(details)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to open student record'
      if (message === 'ACCESS_DENIED') {
        const warning =
          'Security Warning: Attempted access to conflicting bank data has been blocked. This event has been logged.'
        setDeniedDetail('This student is assigned to a different bank.')
        setWarningMessage(warning)
        setDeniedOpen(true)
      } else {
        setError(message)
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  async function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = search.trim()
    if (!query || !dashboard) return

    const exactMatch = dashboard.students.find((student) => student.id === query)
    if (exactMatch) {
      setWarningMessage('')
      const ok = await openStudent(exactMatch.id)
      if (ok) {
        setActionAmount('')
        setAllowanceModalOpen(true)
      }
      return
    }

    if (!/^\d+$/.test(query)) {
      return
    }

    setWarningMessage('')
    const ok = await openStudent(query)
    if (ok) {
      setActionAmount('')
      setAllowanceModalOpen(true)
    }
  }

  async function handleProcessAllowance() {
    if (!selectedStudent || !actionAmount) {
      setError('Enter an amount before processing.')
      return
    }

    const amountValue = sanitizeMoney(actionAmount)
    if (amountValue <= 0) {
      setError('Amount must be greater than zero.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await systemService.processDisbursement(user.id, selectedStudent.student.id, {
        amount: amountValue,
        type: 'allowance',
      })
      const refreshedStudent = await systemService.getBankStudentDetails(user.id, selectedStudent.student.id)
      setSelectedStudent(refreshedStudent)
      setActionAmount('')
      setWarningMessage('')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process allowance'
      if (message === 'ACCESS_DENIED') {
        const warning =
          'Security Warning: Attempted access to conflicting bank data has been blocked. This event has been logged.'
        setDeniedDetail('Disbursement blocked because this student belongs to another bank.')
        setWarningMessage(warning)
        setDeniedOpen(true)
      } else {
        setError(message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!allowanceModalOpen) {
      return undefined
    }

    modalCloseRef.current?.focus()

    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setAllowanceModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [allowanceModalOpen])

  return (
    <div className="bank-shell">
      <aside className={sidebarOpen ? 'bank-sidebar is-open' : 'bank-sidebar'} aria-label="Bank navigation">
        <div className="sidebar-header">
          <p className="sidebar-label">Secure Session</p>
          <h2>{dashboard ? `${dashboard.bank.name} Bank Portal` : 'Bank Portal'}</h2>
          <p className="sidebar-subtitle">
            {dashboard ? `${dashboard.bank.name} - Financial Management Portal` : 'Financial Management Portal'}
          </p>
        </div>

        <div className="sidebar-section">
          <p className="identity-label">Active Bank</p>
          <p className="identity-value">{dashboard ? `${dashboard.bank.name} Bank` : 'Bank'}</p>
        </div>

        <button className="ghost-button sidebar-logout" type="button" onClick={() => void onLogout()}>
          Logout
        </button>
      </aside>
      {sidebarOpen ? (
        <div
          className="sidebar-backdrop"
          role="presentation"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <main className="bank-main">
        <header className="bank-topbar">
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
            <p className="text-muted">Bank Dashboard</p>
            <h1>{dashboard ? dashboard.bank.name : 'Bank Portal'}</h1>
          </div>
        </header>

        {warningMessage ? <div className="alert-banner alert-banner--warn">{warningMessage}</div> : null}

        {dashboard ? (
          <div className="layout-grid">
            <section className="content-card">
              <h2>Assigned Students</h2>
              <form className="filter-row" onSubmit={handleSearchSubmit}>
                <input
                  aria-label="Search assigned students"
                  placeholder="Search by name or ID"
                  value={search}
                  onChange={(event) => setSearch(sanitizeText(event.target.value, 80))}
                />
                <button type="submit" disabled={loading || !search.trim()}>
                  Search
                </button>
              </form>

              <Table
                rows={filteredStudents}
                emptyMessage="No students found for this search"
                columns={[
                  { key: 'name', header: 'Student', render: (row: Student) => row.fullName },
                  { key: 'id', header: 'Student ID', render: (row: Student) => row.id },
                  {
                    key: 'action',
                    header: 'Action',
                    render: (row: Student) => (
                      <div className="table-actions">
                        <button
                          type="button"
                          onClick={() => {
                            setWarningMessage('')
                            void (async () => {
                              const ok = await openStudent(row.id)
                              if (ok) {
                                setActionAmount('')
                                setAllowanceModalOpen(true)
                              }
                            })()
                          }}
                          disabled={loading}
                        >
                          Process Allowance
                        </button>
                      </div>
                    ),
                  },
                ]}
              />

            </section>
          </div>
        ) : (
          <p>Loading bank dashboard...</p>
        )}

        {error ? <p className="error-text">{error}</p> : null}
      </main>

      {allowanceModalOpen && selectedStudent ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="allowance-modal-title">
            <h2 id="allowance-modal-title">Process Allowance</h2>
            <p className="text-muted">Review student details before disbursement.</p>

            <div className="student-header">
              <div>
                <h3>{selectedStudent.student.fullName}</h3>
                <p className="text-muted">Student ID: {selectedStudent.student.id}</p>
              </div>
              <div className="student-loan">
                <p className="text-muted">Loan Limit</p>
                <p className="loan-value">
                  {formatCurrency(selectedStudent.student.loanLimit ?? 0, locale)}
                </p>
              </div>
            </div>

            <div className="student-meta-grid">
              <div>
                <p className="text-muted">Email</p>
                <p>{selectedStudent.student.email}</p>
              </div>
              <div>
                <p className="text-muted">Assigned Bank</p>
                <p>{selectedStudent.student.bankName || selectedStudent.student.bankId}</p>
              </div>
              <div>
                <p className="text-muted">Next Allowance</p>
                <p>
                  {formatCurrency(selectedStudent.student.nextAllowanceAmount, locale)} on{' '}
                  {formatDate(selectedStudent.student.nextAllowanceDate, locale)}
                </p>
              </div>
              <div>
                <p className="text-muted">Total Allowances Paid</p>
                <p>
                  {formatCurrency(
                    selectedStudent.allowances.reduce((sum, item) => sum + item.amount, 0),
                    locale,
                  )}
                </p>
              </div>
            </div>

            <div className="process-panel">
              <label htmlFor="disburse-amount">Amount</label>
              <input
                id="disburse-amount"
                type="number"
                min="1"
                step="0.01"
                value={actionAmount}
                onChange={(event) => setActionAmount(sanitizeText(event.target.value, 16))}
                required
              />
              <div className="process-actions">
                <button type="button" onClick={() => void handleProcessAllowance()} disabled={loading}>
                  Process Allowance
                </button>
                <button
                  ref={modalCloseRef}
                  type="button"
                  className="ghost-button"
                  onClick={() => setAllowanceModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <AccessDeniedModal open={deniedOpen} onClose={() => setDeniedOpen(false)} detail={deniedDetail} />
    </div>
  )
}
