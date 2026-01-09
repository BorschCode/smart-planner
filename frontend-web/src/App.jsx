import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

import Login from './pages/Login';
import Habits from './pages/Habits';
import Profile from './pages/Profile';
import Sidebar from './layout/Sidebar';

function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ❗ LOGIN — БЕЗ layout */}
      <Route path="/login" element={<Login />} />

      {/* ❗ ВСЕ ІНШЕ — З layout */}
      <Route element={<ProtectedLayout />}>
        <Route path="/habits" element={<Habits />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Navigate to="/habits" replace />} />
      </Route>
    </Routes>
  );
}
