import { useLoaderData, useNavigate } from 'react-router-dom';

export default function HabitDetails() {
  /** @type {HabitDTO} */
  const habit = useLoaderData();
  const nav = useNavigate();

  return (
    <div className="max-w-xl bg-white shadow rounded p-6 space-y-4">
      <h1 className="text-xl font-bold">{habit.title}</h1>

      <p className="text-gray-600">{habit.description || 'No description'}</p>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <b>Type:</b> {habit.type}
        </div>
        <div>
          <b>Frequency:</b> {habit.frequency}
        </div>
        <div>
          <b>Status:</b> {habit.is_active ? 'Active' : 'Disabled'}
        </div>
        <div>
          <b>Created:</b> {new Date(habit.created_at).toLocaleDateString()}
        </div>
      </div>

      <button onClick={() => nav(-1)} className="px-3 py-1 bg-gray-200 rounded">
        ← Back
      </button>
    </div>
  );
}
