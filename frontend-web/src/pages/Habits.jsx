import { useLoaderData } from 'react-router-dom';
import api from '../api/axios';
import { useState } from 'react';

export default function Habits() {
  const initial = useLoaderData(); // ← серверні дані
  const [habits, setHabits] = useState(initial);

  const reload = async () => {
    const res = await api.get('/api/habits');
    setHabits(res.data.data);
  };

  const markDone = async id => {
    await api.post(`/api/habits/${id}/complete`);
    await reload();
  };

  const deleteHabit = async id => {
    await api.delete(`/api/habits/${id}`);
    await reload();
  };

  return (
    <table>
      <tbody>
        {habits.map(h => (
          <tr key={h.id}>
            <td>{h.title}</td>
            <td>{h.frequency}</td>
            <td>
              <button onClick={() => markDone(h.id)}>✓</button>
              <button onClick={() => deleteHabit(h.id)}>🗑</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
