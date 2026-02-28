import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Paths from './pages/Paths'
import PathDetail from './pages/PathDetail'
import LessonPlayer from './pages/LessonPlayer'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPaths from './pages/admin/AdminPaths'
import AdminPathDetail from './pages/admin/AdminPathDetail'
import AdminLessonDetail from './pages/admin/AdminLessonDetail'
import AdminUsers from './pages/admin/AdminUsers'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/paths" element={<ProtectedRoute><Paths /></ProtectedRoute>} />
      <Route path="/paths/:slug" element={<ProtectedRoute><PathDetail /></ProtectedRoute>} />
      <Route path="/lessons/:id" element={<ProtectedRoute><LessonPlayer /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/paths" element={<AdminRoute><AdminPaths /></AdminRoute>} />
      <Route path="/admin/paths/:id" element={<AdminRoute><AdminPathDetail /></AdminRoute>} />
      <Route path="/admin/paths/:pathId/lessons/:lessonId" element={<AdminRoute><AdminLessonDetail /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
