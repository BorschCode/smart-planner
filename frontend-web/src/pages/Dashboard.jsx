import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../auth/AuthContext';

export default function Dashboard() {
    const { user, logout } = useAuth();

    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 🔒 Захист: якщо нема user — не робимо запит
        if (!user) return;

        api.get('/api/habits')
            .then(res => {
                setHabits(res.data.data);
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    setError('Unauthorized');
                } else {
                    setError('Failed to load habits');
                }
            })
            .finally(() => setLoading(false));
    }, [user]);

    if (loading) return <div>Loading habits...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <header>
                <h1>Welcome, {user.name}</h1>
                <button onClick={logout}>Logout</button>
            </header>

            <ul>
                {habits.map(habit => (
                    <li key={habit.id}>
                        {habit.title} ({habit.frequency})
                    </li>
                ))}
            </ul>
        </div>
    );
}
