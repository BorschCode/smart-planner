import { useLoaderData, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';
import CreateHabitForm from '../components/habbits/CreateHabitForm.jsx';
import { Link } from 'react-router-dom';
import { routes } from '../routes.js';

export default function Habits() {
  const initial = useLoaderData();
  const [habits, setHabits] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const reload = async () => {
    const res = await api.get(routes.habits());
    setHabits(res.data.data);
  };

  const markDone = async id => {
    await api.post(routes.habitComplete(id));
    await reload();
  };

  const deleteHabit = async id => {
    if (!confirm('Delete this habit?')) return;
    await api.delete(routes.habit(id));
    await reload();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Habits</h1>

        <button
          onClick={() => setShowForm(true)}
          className="px-3 py-1 bg-indigo-600 text-white rounded"
        >
          + Add Habit
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <CreateHabitForm
          onCreated={() => {
            setShowForm(false);
            reload();
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Title</th>
              <th className="p-2 text-left">Frequency</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {habits.map(h => (
              <tr key={h.id} className="border-t">
                <td className="p-2">{h.title}</td>
                <td className="p-2">{h.frequency}</td>
                <td className="p-2">{h.type}</td>

                <td className="p-2 flex gap-2 justify-center">
                  <Link
                    to={routes.habit(h.id)}
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                  >
                    👁 View
                  </Link>
                  <button onClick={() => navigate(routes.habit(h.id), { state: { edit: true } })}>
                    ✏️ Edit
                  </button>
                  <Link
                    to={routes.habit(h.id)}
                    className="px-2 py-1 bg-blue-600 text-white rounded"
                  >
                    🖋
                  </Link>
                  <button
                    onClick={() => markDone(h.id)}
                    className="px-2 py-1 bg-green-600 text-white rounded"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => deleteHabit(h.id)}
                    className="px-2 py-1 bg-red-600 text-white rounded"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}

            {habits.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No habits yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
