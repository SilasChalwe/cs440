import { useSession } from './hooks/useSession'
import { AdminPortal } from './pages/admin/AdminPortal'
import { BankPortal } from './pages/bank/BankPortal'
import { LoginPage } from './pages/login/LoginPage'
import { StudentPortal } from './pages/student/StudentPortal'

function App() {
  const { user, loading, error, timedOut, login, logout } = useSession()

  if (!user) {
    return <LoginPage loading={loading} error={error} timedOut={timedOut} onLogin={login} />
  }

  if (user.role === 'student') {
    return <StudentPortal user={user} onLogout={logout} />
  }

  if (user.role === 'bank') {
    return <BankPortal user={user} onLogout={logout} />
  }

  return <AdminPortal user={user} onLogout={logout} />
}

export default App
