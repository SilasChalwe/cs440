import {
  initialAllowances,
  initialBanks,
  initialLogs,
  initialMessages,
  initialStudents,
  initialTransactions,
  initialUsers,
} from './mockData'
import type {
  AccessLog,
  AdminDashboardData,
  AllowanceRecord,
  Bank,
  BankDashboardData,
  LogFilter,
  LoginInput,
  Message,
  SessionUser,
  Student,
  StudentDashboardData,
  Transaction,
  UserAccount,
} from '../types/domain'
import type { SystemService } from './systemService'
import { generateId } from '../utils/format'
import { sanitizeEmail, sanitizePhone, sanitizeText } from '../utils/security'

interface MockDb {
  users: UserAccount[]
  students: Student[]
  banks: Bank[]
  allowances: AllowanceRecord[]
  transactions: Transaction[]
  messages: Message[]
  logs: AccessLog[]
}

const DB: MockDb = {
  users: structuredClone(initialUsers),
  students: structuredClone(initialStudents),
  banks: structuredClone(initialBanks),
  allowances: structuredClone(initialAllowances),
  transactions: structuredClone(initialTransactions),
  messages: structuredClone(initialMessages),
  logs: structuredClone(initialLogs),
}

const DELAY_MS = 250

function wait(): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, DELAY_MS)
  })
}

function withLog(entry: Omit<AccessLog, 'id' | 'timestamp'>): void {
  DB.logs.unshift({
    ...entry,
    id: generateId('log'),
    timestamp: new Date().toISOString(),
  })
}

function getUser(userId: string): UserAccount {
  const user = DB.users.find((u) => u.id === userId)
  if (!user) {
    throw new Error('User not found')
  }
  return user
}

function assertBankAccess(bankUserId: string, studentId: string): { student: Student; user: UserAccount } {
  const user = getUser(bankUserId)
  const student = DB.students.find((s) => s.id === studentId)

  if (!student) {
    throw new Error('Student not found')
  }

  if (!user.bankId || student.bankId !== user.bankId) {
    withLog({
      userId: user.id,
      role: user.role,
      bankId: user.bankId,
      studentId,
      action: 'denied',
      details: 'Chinese Wall restriction: attempted access to competing bank student',
      result: 'denied',
    })

    throw new Error('ACCESS_DENIED')
  }

  return { student, user }
}

function buildStudentDashboard(studentId: string): StudentDashboardData {
  const student = DB.students.find((s) => s.id === studentId)
  if (!student) {
    throw new Error('Student not found')
  }

  return {
    student,
    allowances: DB.allowances.filter((a) => a.studentId === studentId),
    transactions: DB.transactions.filter((t) => t.studentId === studentId),
    messages: DB.messages.filter((m) => m.studentId === studentId),
  }
}

function filterLogs(logs: AccessLog[], filter?: LogFilter): AccessLog[] {
  if (!filter) {
    return logs
  }

  return logs.filter((log) => {
    const time = new Date(log.timestamp).getTime()
    const fromOk = filter.fromDate ? time >= new Date(filter.fromDate).getTime() : true
    const toOk = filter.toDate ? time <= new Date(`${filter.toDate}T23:59:59.999`).getTime() : true
    const bankOk = filter.bankId ? log.bankId === filter.bankId : true
    const studentOk = filter.studentId ? log.studentId === filter.studentId : true

    return fromOk && toOk && bankOk && studentOk
  })
}

export const mockSystemService: SystemService = {
  async login(input: LoginInput): Promise<SessionUser> {
    await wait()

    const user = DB.users.find(
      (account) =>
        account.active &&
        account.username === input.username &&
        account.password === input.password,
    )

    if (!user) {
      throw new Error('Invalid credentials')
    }

    withLog({
      userId: user.id,
      role: user.role,
      bankId: user.bankId,
      studentId: user.studentId,
      action: 'login',
      details: 'User authenticated',
      result: 'success',
    })

    return {
      id: user.id,
      role: user.role,
      displayName: user.displayName,
      bankId: user.bankId,
      studentId: user.studentId,
    }
  },

  async logLogout(userId: string): Promise<void> {
    await wait()
    const user = getUser(userId)

    withLog({
      userId,
      role: user.role,
      bankId: user.bankId,
      studentId: user.studentId,
      action: 'logout',
      details: 'User logged out',
      result: 'success',
    })
  },

  async getStudentDashboard(studentId: string): Promise<StudentDashboardData> {
    await wait()
    return buildStudentDashboard(studentId)
  },

  async updateStudentContact(studentId: string, payload: { email: string; phone: string }): Promise<Student> {
    await wait()
    const index = DB.students.findIndex((s) => s.id === studentId)

    if (index < 0) {
      throw new Error('Student not found')
    }

    DB.students[index] = {
      ...DB.students[index],
      email: sanitizeEmail(payload.email),
      phone: sanitizePhone(payload.phone),
    }

    const student = DB.students[index]
    const user = DB.users.find((item) => item.studentId === studentId)

    withLog({
      userId: user?.id ?? 'unknown',
      role: 'student',
      studentId,
      bankId: student.bankId,
      action: 'update',
      details: 'Student updated contact details',
      result: 'success',
    })

    return student
  },

  async sendStudentMessage(studentId: string, content: string): Promise<void> {
    await wait()

    DB.messages.unshift({
      id: generateId('msg'),
      studentId,
      sender: 'student',
      content: sanitizeText(content, 600),
      timestamp: new Date().toISOString(),
    })

    const user = DB.users.find((item) => item.studentId === studentId)
    const student = DB.students.find((item) => item.id === studentId)

    withLog({
      userId: user?.id ?? 'unknown',
      role: 'student',
      studentId,
      bankId: student?.bankId,
      action: 'update',
      details: 'Student sent a secure message',
      result: 'success',
    })
  },

  async acknowledgeAllowance(studentId: string, allowanceId: string): Promise<void> {
    await wait()

    const allowance = DB.allowances.find((a) => a.id === allowanceId && a.studentId === studentId)
    if (!allowance) {
      throw new Error('Allowance record not found')
    }

    allowance.status = 'Acknowledged'

    const user = DB.users.find((item) => item.studentId === studentId)
    const student = DB.students.find((item) => item.id === studentId)

    withLog({
      userId: user?.id ?? 'unknown',
      role: 'student',
      studentId,
      bankId: student?.bankId,
      action: 'update',
      details: 'Student acknowledged allowance receipt',
      result: 'success',
    })
  },

  async getBankDashboard(bankUserId: string): Promise<BankDashboardData> {
    await wait()

    const user = getUser(bankUserId)
    if (!user.bankId) {
      throw new Error('Bank account missing bank assignment')
    }

    const bank = DB.banks.find((item) => item.id === user.bankId)
    if (!bank) {
      throw new Error('Bank not found')
    }

    withLog({
      userId: user.id,
      role: user.role,
      bankId: user.bankId,
      action: 'view',
      details: 'Viewed bank dashboard',
      result: 'success',
    })

    const students = DB.students.filter((student) => student.bankId === user.bankId)
    const transactions = DB.transactions.filter((transaction) => transaction.bankId === user.bankId)
    const pendingApprovals = transactions.filter((transaction) => transaction.status === 'Pending approval').length

    return {
      bank,
      students,
      transactions,
      alerts: pendingApprovals
        ? [`${pendingApprovals} transaction(s) waiting for approval`] : ['No pending approvals'],
    }
  },

  async getBankStudentDetails(bankUserId: string, studentId: string): Promise<StudentDashboardData> {
    await wait()

    const { user } = assertBankAccess(bankUserId, studentId)

    withLog({
      userId: user.id,
      role: user.role,
      bankId: user.bankId,
      studentId,
      action: 'view',
      details: 'Viewed assigned student details',
      result: 'success',
    })

    return buildStudentDashboard(studentId)
  },

  async processDisbursement(
    bankUserId: string,
    studentId: string,
    payload: { amount: number; type: Transaction['type'] },
  ): Promise<void> {
    await wait()

    const { user, student } = assertBankAccess(bankUserId, studentId)

    DB.transactions.unshift({
      id: generateId('txn'),
      studentId,
      bankId: user.bankId ?? '',
      bankUserId,
      type: payload.type,
      amount: payload.amount,
      status: 'Completed',
      date: new Date().toISOString(),
    })

    if (payload.type === 'allowance') {
      DB.allowances.unshift({
        id: generateId('allow'),
        studentId,
        date: new Date().toISOString(),
        amount: payload.amount,
        status: 'Paid',
      })
    }

    withLog({
      userId: user.id,
      role: user.role,
      bankId: user.bankId,
      studentId,
      action: 'disburse',
      details: `Processed ${payload.type} disbursement for ${student.fullName}`,
      result: 'success',
    })
  },

  async getAdminDashboard(): Promise<AdminDashboardData> {
    await wait()

    return {
      banks: DB.banks,
      students: DB.students,
      loans: DB.students.map((student) => ({
        id: `loan-${student.id}`,
        studentId: student.id,
        amount: student.loan.principal,
        date: student.loan.repaymentStartDate,
      })),
      allowances: DB.allowances,
      transactions: DB.transactions,
      logs: DB.logs,
      users: DB.users,
    }
  },

  async reassignStudentToBank(adminUserId: string, studentId: string, bankId: string): Promise<void> {
    await wait()

    const admin = getUser(adminUserId)
    const student = DB.students.find((item) => item.id === studentId)
    const bank = DB.banks.find((item) => item.id === bankId)

    if (!student || !bank) {
      throw new Error('Invalid assignment data')
    }

    const previousBankId = student.bankId
    student.bankId = bankId

    withLog({
      userId: admin.id,
      role: admin.role,
      bankId,
      studentId,
      action: 'assign',
      details: `Student reassigned from ${previousBankId} to ${bankId}`,
      result: 'success',
    })
  },

  async toggleUserActive(adminUserId: string, userId: string): Promise<UserAccount> {
    await wait()

    const admin = getUser(adminUserId)
    const user = getUser(userId)
    user.active = !user.active

    withLog({
      userId: admin.id,
      role: admin.role,
      bankId: user.bankId,
      studentId: user.studentId,
      action: 'update',
      details: `Admin changed account state for ${user.username} to ${user.active ? 'active' : 'disabled'}`,
      result: 'success',
    })

    return user
  },

  async getAccessLogs(filter?: LogFilter): Promise<AccessLog[]> {
    await wait()
    return filterLogs(DB.logs, filter)
  },
}
