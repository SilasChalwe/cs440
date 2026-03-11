import { useEffect, useMemo, useRef, useState } from 'react'
import { LogDetailModal } from '../../components/LogDetailModal'
import { Table } from '../../components/Table'
import { systemService } from '../../services'
import type { AccessLog, AdminDashboardData, SessionUser } from '../../types/domain'
import { formatCurrency, formatDate } from '../../utils/format'

interface AdminPortalProps {
  user: SessionUser
  onLogout: () => Promise<void>
}

interface AdminModel {
  totalStudents: number
  activeBanks: number
  totalFunds: number
  students: AdminDashboardData['students']
  logs: AccessLog[]
  bankName: (bankId: string) => string
  bankStats: { id: string; name: string; studentCount: number }[]
}

export function AdminPortal({ user, onLogout }: AdminPortalProps) {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [error, setError] = useState('')
  const [selectedLog, setSelectedLog] = useState<AccessLog | null>(null)
  const [view, setView] = useState<'dashboard' | 'logs' | 'assignments'>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bankModalOpen, setBankModalOpen] = useState(false)
  const [assignmentStudentId, setAssignmentStudentId] = useState('')
  const [assignmentBankId, setAssignmentBankId] = useState('')
  const [assignmentError, setAssignmentError] = useState('')
  const [assignmentSuccess, setAssignmentSuccess] = useState('')
  const [assignmentBusy, setAssignmentBusy] = useState(false)
  const bankModalCloseRef = useRef<HTMLButtonElement | null>(null)
  const locale = navigator.language || 'en-US'

  useEffect(() => {
    if (user.role !== 'admin') return

    async function load() {
      try {
        setError('')
        const dashboard = await systemService.getAdminDashboard()
        setData(dashboard)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard'
        setError(message)
      }
    }

    void load()
  }, [user.role])

  useEffect(() => {
    if (!bankModalOpen) {
      return undefined
    }

    bankModalCloseRef.current?.focus()

    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setBankModalOpen(false)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('keydown', handleKey)
    }
  }, [bankModalOpen])

  const model = useMemo<AdminModel | null>(() => {
    if (!data) return null

    const bankName = (bankId: string): string =>
      data.banks.find((bank) => bank.id === bankId)?.name || `Bank ${bankId}`

    const logs = [...data.logs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    const totalFunds =
      data.loans.reduce((sum, loan) => sum + loan.amount, 0) +
      data.allowances.reduce((sum, allowance) => sum + allowance.amount, 0)

    const studentCounts = data.students.reduce<Record<string, number>>((acc, student) => {
      acc[student.bankId] = (acc[student.bankId] ?? 0) + 1
      return acc
    }, {})

    const bankStats = data.banks
      .map((bank) => ({
        id: bank.id,
        name: bank.name,
        studentCount: studentCounts[bank.id] ?? 0,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    return {
      totalStudents: data.students.length,
      activeBanks: data.banks.length,
      totalFunds,
      students: data.students,
      logs,
      bankName,
      bankStats,
    }
  }, [data])

  useEffect(() => {
    if (!model) return
    if (!assignmentStudentId) {
      setAssignmentBankId('')
      return
    }
    const student = model.students.find((item) => item.id === assignmentStudentId)
    if (student) {
      setAssignmentBankId(student.bankId)
    }
  }, [assignmentStudentId, model])

  const handleAssignStudent = async (): Promise<void> => {
    if (!model) return
    if (!assignmentStudentId || !assignmentBankId) return

    setAssignmentError('')
    setAssignmentSuccess('')
    setAssignmentBusy(true)

    try {
      await systemService.reassignStudentToBank(user.id, assignmentStudentId, assignmentBankId)
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          students: prev.students.map((student) =>
            student.id === assignmentStudentId ? { ...student, bankId: assignmentBankId } : student,
          ),
        }
      })
      const studentName = model.students.find((item) => item.id === assignmentStudentId)?.fullName ?? 'Student'
      const bankLabel = model.bankName(assignmentBankId)
      setAssignmentSuccess(`${studentName} assigned to ${bankLabel}.`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to assign student'
      setAssignmentError(message)
    } finally {
      setAssignmentBusy(false)
    }
  }

  if (user.role !== 'admin') {
    return (
      <div className="admin-shell">
        <div className="content-card">
          <h2>Protected Area</h2>
          <p className="error-text">Admin access required.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <aside className={sidebarOpen ? 'admin-sidebar is-open' : 'admin-sidebar'} aria-label="Admin navigation">
        <div className="sidebar-header">
          <p className="sidebar-label">Secure Session</p>
          <h2>University Student Loan &amp; Allowance System</h2>
          <p className="sidebar-subtitle">Admin Dashboard</p>
        </div>

        <nav className="sidebar-nav">
          <button
            type="button"
            className={view === 'dashboard' ? 'tab-button active' : 'tab-button'}
            onClick={() => {
              setView('dashboard')
              setSidebarOpen(false)
            }}
          >
            Overview
          </button>
          <button
            type="button"
            className={view === 'logs' ? 'tab-button active' : 'tab-button'}
            onClick={() => {
              setView('logs')
              setSidebarOpen(false)
            }}
          >
            Access Log (Recent)
          </button>
          <button
            type="button"
            className={view === 'assignments' ? 'tab-button active' : 'tab-button'}
            onClick={() => {
              setView('assignments')
              setSidebarOpen(false)
            }}
          >
            Assignments
          </button>
          {model ? (
            <section className="overview-grid">
              <article className="overview-card">
                <p className="overview-label">Total Students</p>
                <p className="overview-value">{model.totalStudents}</p>
              </article>
              <button
                type="button"
                className="overview-card-button"
                onClick={() => setBankModalOpen(true)}
                aria-haspopup="dialog"
              >
                <p className="overview-label">Active Banks</p>
                <p className="overview-value">{model.activeBanks}</p>
              </button>
              <article className="overview-card">
                <p className="overview-label">Total Funds Distributed</p>
                <p className="overview-value">{formatCurrency(model.totalFunds, locale)}</p>
              </article>
            </section>
          ) : (
            <section className="overview-grid" aria-live="polite">
              <article className="overview-card">
                <p className="overview-label">Total Students</p>
                <p className="overview-value">Loading...</p>
              </article>
              <article className="overview-card">
                <p className="overview-label">Active Banks</p>
                <p className="overview-value">Loading...</p>
              </article>
              <article className="overview-card">
                <p className="overview-label">Total Funds Distributed</p>
                <p className="overview-value">Loading...</p>
              </article>
            </section>
          )}

          
        </nav>

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

      <main className="admin-main">
        <header className="admin-topbar">
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
        </header>

        {model ? (
          <>
            {view === 'dashboard' ? (
              <>
                <section className="content-card">
                  <h2>Students & Bank Assignments</h2>
                  <Table
                    rows={model.students}
                    emptyMessage="No students available"
                    columns={[
                      { key: 'id', header: 'Student ID', render: (row) => row.id },
                      { key: 'name', header: 'Full Name', render: (row) => row.fullName },
                      {
                        key: 'bank',
                        header: 'Assigned Bank',
                        render: (row) => model.bankName(row.bankId),
                      },
                    ]}
                  />
                </section>
              </>
            ) : view === 'assignments' ? (
              <section className="content-card">
                <h2>Manual Bank Assignment</h2>
                <p className="text-muted">Select a student and assign them to a specific bank.</p>
                <div className="form-grid">
                  <div className="profile-field">
                    <label htmlFor="assignment-student">Student</label>
                    <select
                      id="assignment-student"
                      value={assignmentStudentId}
                      onChange={(event) => {
                        setAssignmentStudentId(event.target.value)
                        setAssignmentSuccess('')
                        setAssignmentError('')
                      }}
                    >
                      <option value="">Select student</option>
                      {[...model.students]
                        .sort((a, b) => a.fullName.localeCompare(b.fullName))
                        .map((student) => (
                          <option key={student.id} value={student.id}>
                            {student.fullName} (ID {student.id})
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="profile-field">
                    <label htmlFor="assignment-bank">Bank</label>
                    <select
                      id="assignment-bank"
                      value={assignmentBankId}
                      onChange={(event) => {
                        setAssignmentBankId(event.target.value)
                        setAssignmentSuccess('')
                        setAssignmentError('')
                      }}
                      disabled={!assignmentStudentId}
                    >
                      <option value="">Select bank</option>
                      {model.bankStats.map((bank) => (
                        <option key={bank.id} value={bank.id}>
                          {bank.name} ({bank.studentCount} students)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => void handleAssignStudent()}
                    disabled={
                      assignmentBusy ||
                      !assignmentStudentId ||
                      !assignmentBankId ||
                      model.students.find((student) => student.id === assignmentStudentId)?.bankId ===
                        assignmentBankId
                    }
                  >
                    {assignmentBusy ? 'Assigning...' : 'Assign Student'}
                  </button>
                </div>
                {assignmentError ? <p className="error-text">{assignmentError}</p> : null}
                {assignmentSuccess ? <p className="text-muted">{assignmentSuccess}</p> : null}
              </section>
            ) : (
              <section className="content-card">
                <h2>Access Log (Recent)</h2>
                <div className="audit-panel" role="list">
                  {model.logs.slice(0, 10).map((log) => (
                    <button
                      key={log.id}
                      type="button"
                      className={`audit-item ${log.result === 'denied' ? 'audit-item--denied' : 'audit-item--success'}`}
                      onClick={() => setSelectedLog(log)}
                    >
                      <div className="audit-title">
                        {log.result === 'denied' ? 'Blocked' : 'Allowed'}: {log.userId} ({log.role})
                      </div>
                      <div className="audit-meta">
                        {formatDate(log.timestamp, locale)} • {log.action}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-muted">Select a log entry to view details.</p>
              </section>
            )}
          </>
        ) : (
          <p>Loading admin dashboard...</p>
        )}

        {error ? <p className="error-text">{error}</p> : null}
      </main>

      <LogDetailModal open={Boolean(selectedLog)} log={selectedLog} onClose={() => setSelectedLog(null)} />
      {model && bankModalOpen ? (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="bank-summary-title">
            <h2 id="bank-summary-title">Active Banks</h2>
            <p className="text-muted">Student assignments by bank.</p>
            <Table
              rows={model.bankStats}
              emptyMessage="No banks available"
              columns={[
                { key: 'name', header: 'Bank', render: (row) => row.name },
                { key: 'students', header: 'Students', render: (row) => row.studentCount },
              ]}
            />
            <div className="modal-actions">
              <button ref={bankModalCloseRef} type="button" onClick={() => setBankModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
