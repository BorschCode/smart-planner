import { useState } from 'react';
import { HttpStatusCode } from 'axios';

export default function HabitForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    type: initial?.type ?? 'habit',
    frequency: initial?.frequency ?? 'daily',
    is_active: initial?.is_active ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(form);
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
        <button disabled={loading}>{initial ? 'Update' : 'Create'}</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
