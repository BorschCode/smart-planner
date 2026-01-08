import { AuthProvider, useAuth } from './auth/AuthContext';
import LoginForm from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';

function AppContent() {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? <Dashboard /> : <LoginForm />;
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
