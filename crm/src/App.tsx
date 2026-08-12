import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './routes/Login'
import Dashboard from './routes/Dashboard'
import AlunosList from './routes/Alunos/AlunosList'
import AlunoForm from './routes/Alunos/AlunoForm'
import AlunoDetail from './routes/Alunos/AlunoDetail'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alunos" element={<AlunosList />} />
            <Route path="/alunos/novo" element={<AlunoForm />} />
            <Route path="/alunos/:id" element={<AlunoDetail />} />
            <Route path="/alunos/:id/editar" element={<AlunoForm />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
