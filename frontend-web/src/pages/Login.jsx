import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export default function LoginForm() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const submit = async e => {
        e.preventDefault();
        setError(null);
        try {
            await login(email, password);
        } catch {
            setError('Invalid credentials');
        }
    };

    return (
        <form onSubmit={submit}>
            <input value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <button>Login</button>
            {error && <p>{error}</p>}
        </form>
    );
}
