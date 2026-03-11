import type {
  AccessLog,
  AllowanceRecord,
  Bank,
  Message,
  Student,
  Transaction,
  UserAccount,
} from '../types/domain'

const now = new Date()
const iso = (daysOffset: number): string => {
  const d = new Date(now)
  d.setDate(d.getDate() + daysOffset)
  return d.toISOString()
}

export const initialBanks: Bank[] = [
  { id: 'bank-zanaco', name: 'Zanaco' },
  { id: 'bank-fnb', name: 'FNB' },
]

export const initialStudents: Student[] = [
  {
    id: 'stu-silas',
    fullName: 'Silas Chalwe',
    email: 'silas@campus.edu.zm',
    phone: '+260970000101',
    bankId: 'bank-zanaco',
    accountNumber: '1234567812349012',
    allowanceAmount: 4200,
    loanLimit: 70000,
    nextAllowanceDate: iso(6),
    nextAllowanceAmount: 4200,
    loan: {
      principal: 60000,
      interestRate: 5.2,
      balance: 38250,
      repaymentStartDate: iso(120),
      status: 'Good Standing',
    },
  },
  {
    id: 'stu-eric',
    fullName: 'Eric Sakala',
    email: 'eric@campus.edu.zm',
    phone: '+260970000102',
    bankId: 'bank-fnb',
    accountNumber: '9988776655441122',
    allowanceAmount: 3900,
    loanLimit: 65000,
    nextAllowanceDate: iso(6),
    nextAllowanceAmount: 3900,
    loan: {
      principal: 55000,
      interestRate: 4.9,
      balance: 34100,
      repaymentStartDate: iso(110),
      status: 'Good Standing',
    },
  },
  {
    id: 'stu-ebber',
    fullName: 'Ebber Matakala',
    email: 'ebber@campus.edu.zm',
    phone: '+260970000103',
    bankId: 'bank-zanaco',
    accountNumber: '1111222233334444',
    allowanceAmount: 4500,
    loanLimit: 72000,
    nextAllowanceDate: iso(10),
    nextAllowanceAmount: 4500,
    loan: {
      principal: 62000,
      interestRate: 5.1,
      balance: 44800,
      repaymentStartDate: iso(150),
      status: 'Pending Review',
    },
  },
  {
    id: 'stu-emmanuel',
    fullName: 'Emmanuel Mwaba',
    email: 'emmanuel@campus.edu.zm',
    phone: '+260970000104',
    bankId: 'bank-fnb',
    accountNumber: '2222333344445555',
    allowanceAmount: 4100,
    loanLimit: 68000,
    nextAllowanceDate: iso(12),
    nextAllowanceAmount: 4100,
    loan: {
      principal: 50000,
      interestRate: 4.7,
      balance: 28700,
      repaymentStartDate: iso(95),
      status: 'Good Standing',
    },
  },
]

export const initialAllowances: AllowanceRecord[] = [
  { id: 'allow-1', studentId: 'stu-silas', date: iso(-28), amount: 4200, status: 'Paid' },
  { id: 'allow-2', studentId: 'stu-silas', date: iso(-58), amount: 4200, status: 'Acknowledged' },
  { id: 'allow-3', studentId: 'stu-eric', date: iso(-28), amount: 3900, status: 'Paid' },
  { id: 'allow-4', studentId: 'stu-ebber', date: iso(-32), amount: 4500, status: 'Pending' },
  { id: 'allow-5', studentId: 'stu-emmanuel', date: iso(-31), amount: 4100, status: 'Paid' },
]

export const initialTransactions: Transaction[] = [
  {
    id: 'txn-1',
    studentId: 'stu-silas',
    bankId: 'bank-zanaco',
    bankUserId: 'user-bank-zanaco',
    type: 'allowance',
    amount: 4200,
    status: 'Completed',
    date: iso(-28),
  },
  {
    id: 'txn-2',
    studentId: 'stu-eric',
    bankId: 'bank-fnb',
    bankUserId: 'user-bank-fnb',
    type: 'allowance',
    amount: 3900,
    status: 'Completed',
    date: iso(-28),
  },
  {
    id: 'txn-3',
    studentId: 'stu-ebber',
    bankId: 'bank-zanaco',
    bankUserId: 'user-bank-zanaco',
    type: 'loan',
    amount: 6200,
    status: 'Pending approval',
    date: iso(-4),
  },
]

export const initialMessages: Message[] = [
  {
    id: 'msg-1',
    studentId: 'stu-silas',
    sender: 'university',
    content: 'Your repayment schedule was updated for next semester.',
    timestamp: iso(-5),
  },
  {
    id: 'msg-2',
    studentId: 'stu-silas',
    sender: 'student',
    content: 'Thank you. I have reviewed the changes.',
    timestamp: iso(-4),
  },
  {
    id: 'msg-3',
    studentId: 'stu-eric',
    sender: 'university',
    content: 'Please confirm your updated mobile number in Profile.',
    timestamp: iso(-2),
  },
]

export const initialUsers: UserAccount[] = [
  {
    id: 'user-student-silas',
    username: 'silas',
    password: 'pass123',
    role: 'student',
    displayName: 'Silas Chalwe',
    studentId: 'stu-silas',
    active: true,
  },
  {
    id: 'user-student-eric',
    username: 'eric',
    password: 'pass123',
    role: 'student',
    displayName: 'Eric Sakala',
    studentId: 'stu-eric',
    active: true,
  },
  {
    id: 'user-bank-zanaco',
    username: 'zanaco_officer',
    password: 'pass123',
    role: 'bank',
    displayName: 'Zanaco Officer',
    bankId: 'bank-zanaco',
    active: true,
  },
  {
    id: 'user-bank-fnb',
    username: 'fnb_officer',
    password: 'pass123',
    role: 'bank',
    displayName: 'FNB Officer',
    bankId: 'bank-fnb',
    active: true,
  },
  {
    id: 'user-admin-main',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    displayName: 'University Admin',
    active: true,
  },
]

export const initialLogs: AccessLog[] = []
