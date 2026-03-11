import type {
  AccessLog,
  AdminDashboardData,
  BankDashboardData,
  LogFilter,
  LoginInput,
  SessionUser,
  Student,
  StudentDashboardData,
  Transaction,
  UserAccount,
} from '../types/domain'

export interface AccessDeniedError {
  code: 'ACCESS_DENIED'
  reason: string
}

export interface SystemService {
  login(input: LoginInput): Promise<SessionUser>
  logLogout(userId: string): Promise<void>

  getStudentDashboard(studentId: string): Promise<StudentDashboardData>
  updateStudentContact(studentId: string, payload: { email: string; phone: string }): Promise<Student>
  sendStudentMessage(studentId: string, content: string): Promise<void>
  acknowledgeAllowance(studentId: string, allowanceId: string): Promise<void>

  getBankDashboard(bankUserId: string): Promise<BankDashboardData>
  getBankStudentDetails(bankUserId: string, studentId: string): Promise<StudentDashboardData>
  processDisbursement(
    bankUserId: string,
    studentId: string,
    payload: { amount: number; type: Transaction['type'] },
  ): Promise<void>

  getAdminDashboard(): Promise<AdminDashboardData>
  reassignStudentToBank(adminUserId: string, studentId: string, bankId: string): Promise<void>
  toggleUserActive(adminUserId: string, userId: string): Promise<UserAccount>
  getAccessLogs(filter?: LogFilter): Promise<AccessLog[]>
}
