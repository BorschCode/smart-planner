import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Lock } from 'lucide-react';
import api from '../../api/axios';
import { routes } from '../../routes';
import { HttpStatusCode } from 'axios';

export default function PasswordChange() {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const submit = async e => {
    e.preventDefault();
    setErrors({});
    setMessage(null);
    setLoading(true);

    try {
      await api.put(routes.userPasswordUpdate(), {
        current_password: currentPassword,
        password,
        password_confirmation: passwordConfirmation,
      });

      // 🔒 security: force logout
      await api.post(routes.logout());

      navigate(routes.login(), {
        replace: true,
        state: {
          flash: {
            type: 'success',
            text: 'Password changed successfully. Please log in again.',
          },
        },
      });
    } catch (err) {
      if (err.response?.status === HttpStatusCode.UnprocessableEntity) {
        setErrors(err.response.data.errors || {});
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to update password. Try again later.',
        });
      }
    } finally {
      setLoading(false);
    }
  };
  const getError = field => errors[field]?.[0];

  return (
    <div className="max-w-xl">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Lock className="text-indigo-600" />
          <h2 className="text-xl font-bold">Change password</h2>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800">
          <AlertTriangle size={20} />
          <p className="text-sm">
            After changing your password, you will be logged out and must log in again using the new
            password.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <Field
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
            error={getError('current_password')}
          />

          <Field
            label="New password"
            type="password"
            value={password}
            onChange={setPassword}
            error={getError('password')}
          />

          <Field
            label="Confirm new password"
            type="password"
            value={passwordConfirmation}
            onChange={setPasswordConfirmation}
          />

          {message && (
            <div className="text-sm rounded-lg p-3 bg-red-50 text-red-700 border border-red-200">
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white font-semibold
              hover:bg-indigo-700 active:bg-indigo-800 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={`w-full rounded-lg border px-4 py-2
          ${error ? 'border-red-500' : 'border-gray-300'}
          focus:outline-none focus:ring-2 focus:ring-indigo-500`}
        required
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
