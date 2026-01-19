import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { routes } from '../../routes.js';
import { HttpStatusCode } from 'axios';

export default function PasswordChange() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Update password
      await api.put(routes.userPassword(), {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });

      // 2. Force logout
      await api.post(routes.logout());

      // 3. Redirect with flash warning
      navigate(routes.login(), {
        replace: true,
        state: {
          flash: {
            type: 'warning',
            text: 'Password changed successfully. Please log in again.',
          },
        },
      });
    } catch (err) {
      if (err.response?.status === HttpStatusCode.UnprocessableEntity) {
        setError(err.response.data?.errors?.current_password?.[0] ?? 'Password validation failed.');
      } else {
        setError('Failed to update password. Try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow space-y-5 max-w-md">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <span>🔐</span> Change password
      </h2>

      <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-sm text-yellow-800">
        Changing your password will log you out from all sessions.
      </div>

      <input
        type="password"
        placeholder="Current password"
        value={currentPassword}
        onChange={e => setCurrentPassword(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      <input
        type="password"
        placeholder="Confirm new password"
        value={passwordConfirmation}
        onChange={e => setPasswordConfirmation(e.target.value)}
        required
        className="w-full border rounded px-3 py-2"
      />

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-2 rounded">
          {error}
        </div>
      )}

      <button
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
