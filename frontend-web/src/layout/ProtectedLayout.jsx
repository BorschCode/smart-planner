import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';


export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
