import { useState } from 'react';
import api from '../api/axios.js';
import { routes } from '../routes.js';
import { useLoaderData } from 'react-router-dom';
import DashboardCharts from '../components/DashboardCharts.jsx';

export default function Dashboard() {
  const { habits, charts } = useLoaderData();

  const [dailyHabits, setDailyHabits] = useState(habits);

  const reloadHabits = async () => {
    const res = await api.get(routes.dashboardHabits());
    setDailyHabits(res.data.data);
  };

  const markDone = async id => {
    await api.post(routes.habitComplete(id));
    await reloadHabits();
  };

  return (
    <div className="space-y-6">
      {/* Charts */}
      <DashboardCharts data={charts} />

      {/* Habits table */}
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
            {dailyHabits.map(h => (
              <tr key={h.id} className="border-t">
                <td className="p-2">{h.title}</td>
                <td className="p-2">{h.frequency}</td>
                <td className="p-2">{h.type}</td>

                <td className="p-2 flex gap-2 justify-center">
                  <button
                    onClick={() => markDone(h.id)}
                    className="px-2 py-1 bg-green-600 text-white rounded"
                  >
                    ✓
                  </button>
                </td>
              </tr>
            ))}

            {dailyHabits.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No habits for today 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
