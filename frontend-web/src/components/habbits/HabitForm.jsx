import { useEffect, useState } from 'react';
import { HttpStatusCode } from 'axios';
import api from '../../api/axios';

export default function HabitForm({ initial, onSubmit, onCancel }) {
  const emptyHabit = {
    title: '',
    description: '',
    type: 'habit',
    frequency: 'daily',
    is_active: true,
  };

  const [form, setForm] = useState({ ...emptyHabit, ...initial });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [types, setTypes] = useState([]);
  const [frequencies, setFrequencies] = useState([]);

  useEffect(() => {
    api.get('/api/meta/habit-types').then(r => setTypes(r.data));
    api.get('/api/meta/habit-frequencies').then(r => setFrequencies(r.data));
  }, []);


  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSubmit(form);
    } catch (err) {
      if (err.response?.status === HttpStatusCode.UnprocessableEntity) {
        setError('Validation failed. Check your inputs.');
      } else {
        setError('Server error.');
      }
    } finally {
      setLoading(false);
    }
  };

  const input =
    'w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none';

  return (
    <form
      onSubmit={submit}
      className="bg-white rounded-xl shadow border border-gray-200 p-6 space-y-5 max-w-xl"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        {initial ? 'Edit Habit' : 'Create Habit'}
      </h2>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          className={input}
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          className={`${input} min-h-[80px]`}
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Type + Frequency */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            className={input}
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
          >
            {types.map(t => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
          <select
            className={input}
            value={form.frequency}
            onChange={e => setForm({ ...form, frequency: e.target.value })}
          >
            {frequencies.map(f => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          className="w-4 h-4 text-indigo-600"
          checked={form.is_active}
          onChange={e => setForm({ ...form, is_active: e.target.checked })}
        />
        <span className="text-sm text-gray-700">Active</span>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        )}
        <button
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {initial ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}
