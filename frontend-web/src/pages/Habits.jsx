import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get('/api/habits');
    setHabits(res.data.data);
  };

  // ---------- Actions ----------

  const markDone = async id => {
    await api.post(`/api/habits/${id}/complete`);
    load();
  };

  const deleteHabit = async id => {
    if (!confirm('Delete habit?')) return;
    await api.delete(`/api/habits/${id}`);
    load();
  };

  // ---------- Sorting ----------

  const changeSort = field => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('asc');
    }
  };

  const sorted = [...habits].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // ---------- UI ----------

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Habits</h1>

      <table className="w-full border-collapse bg-white shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <Th onClick={() => changeSort('title')}>Title</Th>
            <Th onClick={() => changeSort('frequency')}>Frequency</Th>
            <Th onClick={() => changeSort('is_active')}>Status</Th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {sorted.map(habit => (
            <tr key={habit.id} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">{habit.title}</td>
              <td className="p-3">{habit.frequency}</td>
              <td className="p-3">{habit.is_active ? 'Active' : 'Inactive'}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => markDone(habit.id)}
                  className="text-green-600 hover:underline"
                >
                  Complete
                </button>

                <button
                  onClick={() => alert('Edit UI later')}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children, onClick }) {
  return (
    <th onClick={onClick} className="p-3 cursor-pointer select-none hover:bg-gray-200">
      {children}
    </th>
  );
}
