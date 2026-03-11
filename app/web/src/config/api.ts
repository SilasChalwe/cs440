const modeFromEnv = import.meta.env.VITE_BACKEND_API_MODE || import.meta.env.VITE_API_MODE

export const API_CONFIG = {
  mode: (modeFromEnv === 'http' ? 'http' : 'mock') as 'mock' | 'http',
  baseUrl: import.meta.env.VITE_BACKEND_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeoutMs: Number(import.meta.env.VITE_BACKEND_API_TIMEOUT_MS || import.meta.env.VITE_API_TIMEOUT_MS || 10000),
}

export const ENDPOINTS = {
  authLogin: '/api/auth/login',
  health: '/api/health',
  bankProfile: '/api/bank/profile',
  bankStudents: '/api/bank/students',
  bankStudentDetail: '/api/bank/students/:studentId',
  bankStudentSummary: '/api/bank/students/:studentId/summary',
  bankStudentLoans: '/api/bank/students/:studentId/loans',
  bankStudentAllowances: '/api/bank/students/:studentId/allowances',
  studentMe: '/api/student/me',
  studentTransactions: '/api/student/me/transactions',
  adminDashboard: '/api/admin/dashboard',
  adminAccessLogs: '/api/admin/access-logs',
  adminTransactions: '/api/admin/transactions',
  adminStudents: '/api/admin/students',
  reassignStudent: '/api/admin/students/:studentId/bank',
  runMonthlyAllowances: '/api/admin/monthly-allowances/run',
}
