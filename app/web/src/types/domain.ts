export type Role = 'student' | 'bank' | 'admin'

export type LoanStatus = 'Good Standing' | 'Pending Review'
export type AllowanceStatus = 'Pending' | 'Paid' | 'Acknowledged'
export type TransactionType = 'loan' | 'allowance'
export type TransactionStatus = 'Pending approval' | 'Completed'
export type AccessAction = 'login' | 'logout' | 'view' | 'update' | 'disburse' | 'assign' | 'denied'

export interface Bank {
  id: string
  name: string
}

export interface LoanInfo {
  principal: number
  interestRate: number
  balance: number
  repaymentStartDate: string
  status: LoanStatus
}

export interface Student {
  id: string
  fullName: string
  email: string
  phone: string
  bankId: string
  bankName?: string
  accountNumber: string
  allowanceAmount?: number
  loanLimit?: number
  nextAllowanceDate: string
  nextAllowanceAmount: number
  loan: LoanInfo
}

export interface AllowanceRecord {
  id: string
  studentId: string
  date: string
  amount: number
  status: AllowanceStatus
}

export interface Transaction {
  id: string
  studentId: string
  bankId: string
  bankUserId: string
  type: TransactionType
  amount: number
  status: TransactionStatus
  date: string
}

export interface LoanRecord {
  id: string
  studentId: string
  amount: number
  date: string
  note?: string
}

export interface AccessLog {
  id: string
  timestamp: string
  userId: string
  role: Role
  bankId?: string
  studentId?: string
  action: AccessAction
  details: string
  result: 'success' | 'denied'
}

export interface Message {
  id: string
  studentId: string
  sender: 'student' | 'university'
  content: string
  timestamp: string
}

export interface UserAccount {
  id: string
  username: string
  password: string
  role: Role
  displayName: string
  bankId?: string
  studentId?: string
  active: boolean
}

export interface SessionUser {
  id: string
  role: Role
  displayName: string
  bankId?: string
  studentId?: string
}

export interface StudentDashboardData {
  student: Student
  allowances: AllowanceRecord[]
  transactions: Transaction[]
  messages: Message[]
}

export interface BankDashboardData {
  bank: Bank
  students: Student[]
  transactions: Transaction[]
  alerts: string[]
}

export interface AdminDashboardData {
  banks: Bank[]
  students: Student[]
  loans: LoanRecord[]
  allowances: AllowanceRecord[]
  transactions: Transaction[]
  logs: AccessLog[]
  users: UserAccount[]
}

export interface LoginInput {
  role?: Role
  username: string
  password: string
}

export interface LogFilter {
  bankId?: string
  studentId?: string
  fromDate?: string
  toDate?: string
}
