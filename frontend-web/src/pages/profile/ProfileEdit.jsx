import { useState } from 'react';
import { User, AlertTriangle } from 'lucide-react';
import { useProfile } from '../../profile/profileContext';
import api from '../../api/axios';
import { routes } from '../../routes';
import { HttpStatusCode } from 'axios';

export default function ProfileEdit() {
  const profile = useProfile();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const submit = async e => {
    e.preventDefault();
    setErrors({});
    setMessage(null);
    setLoading(true);

    try {
      await api.put(routes.userProfileInfo(), {
        name,
        email,
      });

      if (email !== profile.email) {
        setMessage({
          type: 'warning',
          text: 'Email changed. Please verify your new email address.',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Profile updated successfully.',
        });
      }
    } catch (err) {
      if (err.response?.status === HttpStatusCode.UnprocessableEntity) {
        setErrors(err.response.data.errors || {});
      } else {
        setMessage({
          type: 'error',
          text: 'Failed to update profile. Try again later.',
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
        {/* Header */}
        <div className="flex items-center gap-3">
          <User className="text-indigo-600" />
          <h2 className="text-xl font-bold">Edit profile</h2>
        </div>

        {/* Warning */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-800">
          <AlertTriangle size={20} />
          <p className="text-sm">
            Changing your email will reset verification. You will need to verify the new email
            address.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <Field label="Name" value={name} onChange={setName} error={getError('name')} />

          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            error={getError('email')}
          />

          {message && (
            <div
              className={`text-sm rounded-lg p-3 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : message.type === 'warning'
                    ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
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
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------------------------------------
   Reusable field component (same pattern as
   PasswordChange)
--------------------------------------------- */
function Field({ label, type = 'text', value, onChange, error }) {
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
