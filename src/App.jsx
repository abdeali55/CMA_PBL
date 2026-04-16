import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import AlumniDashboard from './pages/AlumniDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FindMentor from './pages/FindMentor';
import Profile from './pages/Profile';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Toast />
      <Routes>
        <Route path="/" element={user ? <Navigate to={
          user.role === 'student' ? '/dashboard/student' :
          user.role === 'alumni' ? '/dashboard/alumni' :
          '/dashboard/admin'
        } /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/dashboard/student" element={
          <ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/dashboard/alumni" element={
          <ProtectedRoute roles={['alumni']}><AlumniDashboard /></ProtectedRoute>
        } />
        <Route path="/dashboard/admin" element={
          <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
        } />
        <Route path="/find-mentor" element={
          <ProtectedRoute roles={['student']}><FindMentor /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute roles={['student', 'alumni', 'admin']}><Profile /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
