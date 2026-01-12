import { useState } from 'react';
import { HttpStatusCode } from 'axios';
import api from '../../api/axios.js';

export default function CreateHabitForm({ onCreated, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'habit',
    frequency: 'daily',
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post('/api/habits', form);
      onCreated(); // refresh list
    } catch (err) {
      if (err.response?.status === HttpStatusCode.UnprocessableEntity) {
        setError('Validation failed');
      } else {
        setError('Server error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white border rounded p-4 space-y-3">
      <input
        placeholder="Title"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        required
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />

      <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
        <option value="habit">Habit</option>
        <option value="task">Task</option>
      </select>

      <select
        value={form.frequency}
        onChange={e => setForm({ ...form, frequency: e.target.value })}
      >
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={e => setForm({ ...form, is_active: e.target.checked })}
        />
        Active
      </label>

      {error && <div className="text-red-600">{error}</div>}

      <div className="flex gap-2">
        <button disabled={loading}>Create</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
