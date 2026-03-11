import { API_CONFIG, ENDPOINTS } from '../config/api'
import type {
  AccessLog,
  AccessAction,
  AdminDashboardData,
  AllowanceRecord,
  Bank,
  BankDashboardData,
  LoanRecord,
  LoanStatus,
  LogFilter,
  LoginInput,
  SessionUser,
  Student,
  StudentDashboardData,
  Transaction,
  TransactionStatus,
  TransactionType,
  UserAccount,
} from '../types/domain'
import type { SystemService } from './systemService'
import { sanitizeIdentifier, sanitizeMoney, sanitizeText } from '../utils/security'

const TOKEN_STORAGE_KEY = 'sls_token'
const SESSION_EXPIRED_EVENT = 'sls:session-expired'

interface HttpErrorBody {
  message?: string
  error?: string
}

interface BackendLoginResponse {
  token: string
}

interface BackendBank {
  id: number
  code?: string
  name?: string
}

interface BackendStudent {
  id: number
  name: string
  studentNumber?: string
  bankId: number
  bankAccount?: string
  allowanceAmount?: number
  loanLimit?: number
}

interface BackendLoan {
  id: number
  studentId: number
  amount: number
  disbursedAt: string
  note?: string
}

interface BackendAllowance {
  id: number
  studentId: number
  amount: number
  disbursedAt: string
  note?: string
}

interface BackendTransaction {
  id: number
  type: string
  studentId: number
  bankId: number
  amount: number
  processedBy: string
  processedAt: string
  note?: string
}

interface BackendAccessLog {
  id: number
  actor: string
  role: string
  bankId?: number
  studentId?: number
  action: string
  outcome: string
  reason?: string
  timestamp: string
}

interface BackendStudentMeResponse {
  student: BackendStudent
  bank?: BackendBank
  loans: BackendLoan[]
  allowances: BackendAllowance[]
}

interface BackendAdminDashboardResponse {
  banks: BackendBank[]
  students: BackendStudent[]
  loans: BackendLoan[]
  allowances: BackendAllowance[]
  transactions: BackendTransaction[]
  accessLogs: BackendAccessLog[]
}

function getToken(): string {
  return window.localStorage.getItem(TOKEN_STORAGE_KEY) ?? ''
}

function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

function clearToken(): void {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY)
}

function notifySessionExpired(): void {
  window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT))
}

function resolvePath(path: string, params: Record<string, string | number>): string {
  let result = path
  Object.entries(params).forEach(([key, value]) => {
    result = result.replace(`:${key}`, encodeURIComponent(String(value)))
  })
  return result
}

function buildLogQuery(filter?: LogFilter): string {
  if (!filter) {
    return ''
  }

  const query = new URLSearchParams()
  if (filter.bankId) query.set('bankId', filter.bankId)
  if (filter.studentId) query.set('studentId', filter.studentId)
  if (filter.fromDate) query.set('fromDate', filter.fromDate)
  if (filter.toDate) query.set('toDate', filter.toDate)

  const serialized = query.toString()
  return serialized ? `?${serialized}` : ''
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), API_CONFIG.timeoutMs)

  try {
    const headers = new Headers(options.headers)
    if (!headers.has('Content-Type') && options.body) {
      headers.set('Content-Type', 'application/json')
    }

    const token = getToken()
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(`${API_CONFIG.baseUrl}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    })

    const contentType = response.headers.get('Content-Type') || ''
    const isJson = contentType.includes('application/json')
    const data = isJson ? ((await response.json()) as T | HttpErrorBody) : null

    if (!response.ok) {
      if (response.status === 401) {
        clearToken()
        notifySessionExpired()
        throw new Error('SESSION_EXPIRED')
      }
      if (response.status === 403) {
        throw new Error('ACCESS_DENIED')
      }

      const detail = (data as HttpErrorBody | null)?.message ?? (data as HttpErrorBody | null)?.error
      throw new Error(detail || `Request failed with status ${response.status}`)
    }

    return (data as T) ?? ({} as T)
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out')
    }

    throw err
  } finally {
    window.clearTimeout(timeout)
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

function mapRole(raw: unknown, fallback: LoginInput['role']): SessionUser['role'] {
  const roleText = String(raw || '').toUpperCase()
  if (roleText.includes('ADMIN')) return 'admin'
  if (roleText.includes('BANK')) return 'bank'
  if (roleText.includes('STUDENT')) return 'student'
  return fallback || 'student'
}

function inferRoleFromUsername(username: string): SessionUser['role'] {
  const value = username.toLowerCase()
  if (value === 'admin' || value.includes('admin')) return 'admin'
  if (value.startsWith('bank_') || value.includes('bank')) return 'bank'
  return 'student'
}

function mapLoanStatus(hasPending: boolean): LoanStatus {
  return hasPending ? 'Pending Review' : 'Good Standing'
}

function mapTransactionType(type: string): TransactionType {
  return type.includes('ALLOWANCE') ? 'allowance' : 'loan'
}

function mapTransactionStatus(): TransactionStatus {
  return 'Completed'
}

function mapAction(action: string): AccessAction {
  const value = action.toUpperCase()
  if (value.includes('DENIED')) return 'denied'
  if (value.includes('DISBURSE')) return 'disburse'
  if (value.includes('ASSIGN')) return 'assign'
  if (value.includes('UPDATE')) return 'update'
  if (value.includes('LOGIN')) return 'login'
  if (value.includes('LOGOUT')) return 'logout'
  return 'view'
}

function mapStudent(
  base: BackendStudent,
  loans: BackendLoan[] = [],
  allowances: BackendAllowance[] = [],
  bankName?: string,
): Student {
  const totalLoan = loans.reduce((sum, loan) => sum + Number(loan.amount || 0), 0)
  const latestAllowance = allowances[0]
  const defaultAllowanceAmount = Number(base.allowanceAmount || 0)
  const loanLimit = Number(base.loanLimit || 0)
  const nextDate = latestAllowance
    ? new Date(new Date(latestAllowance.disbursedAt).getTime() + 30 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  return {
    id: String(base.id),
    fullName: sanitizeText(base.name, 120),
    email: `${(base.studentNumber || `student${base.id}`).toLowerCase()}@campus.edu.zm`,
    phone: 'N/A',
    bankId: String(base.bankId),
    bankName: bankName ? sanitizeText(bankName, 120) : undefined,
    accountNumber: base.bankAccount ? sanitizeIdentifier(base.bankAccount, 32) : '0000000000000000',
    allowanceAmount: defaultAllowanceAmount,
    loanLimit,
    nextAllowanceDate: nextDate.toISOString(),
    nextAllowanceAmount: Number(latestAllowance?.amount || defaultAllowanceAmount),
    loan: {
      principal: totalLoan,
      interestRate: 5,
      balance: totalLoan,
      repaymentStartDate: loans[0]?.disbursedAt || new Date().toISOString(),
      status: mapLoanStatus(false),
    },
  }
}

function mapTransactions(transactions: BackendTransaction[]): Transaction[] {
  return transactions.map((item) => ({
    id: String(item.id),
    studentId: String(item.studentId),
    bankId: String(item.bankId),
    bankUserId: sanitizeText(item.processedBy, 80),
    type: mapTransactionType(item.type),
    amount: sanitizeMoney(item.amount),
    status: mapTransactionStatus(),
    date: item.processedAt,
  }))
}

function mapAllowances(allowances: BackendAllowance[]): AllowanceRecord[] {
  return allowances.map((item) => ({
    id: String(item.id),
    studentId: String(item.studentId),
    date: item.disbursedAt,
    amount: sanitizeMoney(item.amount),
    status: 'Paid',
  }))
}

function mapLoans(loans: BackendLoan[]): LoanRecord[] {
  return loans.map((loan) => ({
    id: String(loan.id),
    studentId: String(loan.studentId),
    amount: sanitizeMoney(loan.amount),
    date: loan.disbursedAt,
    note: loan.note ? sanitizeText(loan.note, 180) : undefined,
  }))
}

function mapAccessLogs(logs: BackendAccessLog[]): AccessLog[] {
  return logs.map((log) => ({
    id: String(log.id),
    timestamp: log.timestamp,
    userId: sanitizeText(log.actor, 100),
    role: mapRole(log.role, 'admin'),
    bankId: log.bankId ? String(log.bankId) : undefined,
    studentId: log.studentId ? String(log.studentId) : undefined,
    action: mapAction(log.action),
    details: sanitizeText(log.reason || log.action, 300),
    result: String(log.outcome).toUpperCase() === 'DENIED' ? 'denied' : 'success',
  }))
}

export const httpSystemService: SystemService = {
  async login(input: LoginInput): Promise<SessionUser> {
    const safeUsername = sanitizeIdentifier(input.username, 48)
    const safePassword = sanitizeText(input.password, 72)
    const payload = await request<BackendLoginResponse>(ENDPOINTS.authLogin, {
      method: 'POST',
      body: JSON.stringify({
        username: safeUsername,
        password: safePassword,
      }),
    })

    if (!payload.token) {
      throw new Error('Invalid login response: token missing')
    }

    setToken(payload.token)
    const claims = parseJwtPayload(payload.token)

    const roleFromClaims =
      claims.role ||
      claims.authority ||
      (Array.isArray(claims.authorities) ? (claims.authorities as unknown[]).join(',') : undefined)

    return {
      id: sanitizeIdentifier(claims.sub || claims.userId || safeUsername, 80),
      role: mapRole(roleFromClaims, input.role || inferRoleFromUsername(safeUsername)),
      displayName: sanitizeText(claims.name || claims.fullName || safeUsername, 120),
      bankId: claims.bankId ? sanitizeIdentifier(claims.bankId, 40) : undefined,
      studentId: claims.studentId ? sanitizeIdentifier(claims.studentId, 40) : undefined,
    }
  },

  async logLogout(userId: string): Promise<void> {
    void userId
    clearToken()
  },

  async getStudentDashboard(studentId: string): Promise<StudentDashboardData> {
    void studentId
    const [profile, txResponse] = await Promise.all([
      request<BackendStudentMeResponse>(ENDPOINTS.studentMe),
      request<BackendTransaction[]>(ENDPOINTS.studentTransactions),
    ])

    const allowances = mapAllowances(profile.allowances || [])
    const bankLabel = profile.bank?.name || profile.bank?.code || (profile.bank?.id ? `Bank ${profile.bank.id}` : '')
    const student = mapStudent(profile.student, profile.loans || [], profile.allowances || [], bankLabel)

    return {
      student,
      allowances,
      transactions: mapTransactions(txResponse || []),
      messages: [],
    }
  },

  async updateStudentContact(studentId: string, payload: { email: string; phone: string }): Promise<Student> {
    void studentId
    void payload
    throw new Error('Backend endpoint not available: update student contact')
  },

  async sendStudentMessage(studentId: string, content: string): Promise<void> {
    void studentId
    void content
    throw new Error('Backend endpoint not available: student messages')
  },

  async acknowledgeAllowance(studentId: string, allowanceId: string): Promise<void> {
    void studentId
    void allowanceId
    throw new Error('Backend endpoint not available: acknowledge allowance')
  },

  async getBankDashboard(bankUserId: string): Promise<BankDashboardData> {
    void bankUserId
    const [studentsResponse, bankProfile] = await Promise.all([
      request<BackendStudent[]>(ENDPOINTS.bankStudents),
      request<BackendBank>(ENDPOINTS.bankProfile),
    ])
    const students = (studentsResponse || []).map((student) =>
      mapStudent(student, [], [], bankProfile?.name || bankProfile?.code),
    )
    const bank: Bank = {
      id: String(bankProfile?.id ?? students[0]?.bankId ?? 'assigned'),
      name: sanitizeText(bankProfile?.name || bankProfile?.code || `Bank ${bankProfile?.id ?? ''}`, 120),
    }

    return {
      bank,
      students,
      transactions: [],
      alerts: ['Use student detail actions to process allowances.'],
    }
  },

  async getBankStudentDetails(_bankUserId: string, studentId: string): Promise<StudentDashboardData> {
    void _bankUserId
    const summaryResponse = await request<BackendStudentMeResponse>(
      resolvePath(ENDPOINTS.bankStudentSummary, { studentId }),
    )

    return {
      student: mapStudent(
        summaryResponse.student,
        summaryResponse.loans || [],
        summaryResponse.allowances || [],
        summaryResponse.bank?.name || summaryResponse.bank?.code,
      ),
      allowances: mapAllowances(summaryResponse.allowances || []),
      transactions: [],
      messages: [],
    }
  },

  async processDisbursement(
    _bankUserId: string,
    studentId: string,
    payload: { amount: number; type: Transaction['type'] },
  ): Promise<void> {
    const endpoint =
      payload.type === 'loan'
        ? resolvePath(ENDPOINTS.bankStudentLoans, { studentId })
        : resolvePath(ENDPOINTS.bankStudentAllowances, { studentId })

    const note = payload.type === 'loan' ? 'semester loan' : 'monthly allowance'
    const safeAmount = sanitizeMoney(payload.amount)

    await request(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        amount: safeAmount,
        note,
      }),
    })
  },

  async getAdminDashboard(): Promise<AdminDashboardData> {
    const payload = await request<BackendAdminDashboardResponse>(ENDPOINTS.adminDashboard)

    const loansByStudent = new Map<number, BackendLoan[]>()
    const allowancesByStudent = new Map<number, BackendAllowance[]>()

    ;(payload.loans || []).forEach((loan) => {
      const list = loansByStudent.get(loan.studentId) || []
      list.push(loan)
      loansByStudent.set(loan.studentId, list)
    })

    ;(payload.allowances || []).forEach((allowance) => {
      const list = allowancesByStudent.get(allowance.studentId) || []
      list.push(allowance)
      allowancesByStudent.set(allowance.studentId, list)
    })

    return {
      banks: (payload.banks || []).map((bank) => ({
        id: String(bank.id),
        name: sanitizeText(bank.name || bank.code || `Bank ${bank.id}`, 120),
      })),
      students: (payload.students || []).map((student) =>
        mapStudent(student, loansByStudent.get(student.id) || [], allowancesByStudent.get(student.id) || []),
      ),
      loans: mapLoans(payload.loans || []),
      allowances: mapAllowances(payload.allowances || []),
      transactions: mapTransactions(payload.transactions || []),
      logs: mapAccessLogs(payload.accessLogs || []),
      users: [] as UserAccount[],
    }
  },

  async reassignStudentToBank(adminUserId: string, studentId: string, bankId: string): Promise<void> {
    void adminUserId
    await request(resolvePath(ENDPOINTS.reassignStudent, { studentId }), {
      method: 'PUT',
      body: JSON.stringify({
        bankId: Number(bankId),
      }),
    })
  },

  async toggleUserActive(adminUserId: string, userId: string): Promise<UserAccount> {
    void adminUserId
    void userId
    throw new Error('Backend endpoint not available: toggle user active')
  },

  async getAccessLogs(filter?: LogFilter): Promise<AccessLog[]> {
    const logs = await request<BackendAccessLog[]>(`${ENDPOINTS.adminAccessLogs}${buildLogQuery(filter)}`)
    return mapAccessLogs(logs || [])
  },
}
