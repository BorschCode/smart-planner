import { useProfile } from '../../profile/profileContext.js';
import api from '../../api/axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes.js';

export default function ProfileEdit() {
  const profile = useProfile();
  const navigate = useNavigate();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setErrors(null);
    setLoading(true);

    try {
      await api.put(routes.userProfileInfo(), {
        name,
        email,
      });

      navigate('/profile', {
        state: {
          flash: { type: 'success', text: 'Profile updated' },
        },
      });
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ _error: 'Server error' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="font-bold text-lg">Edit profile</h2>

      <div>
        <label>Name</label>
        <input
          className="w-full border rounded px-3 py-2"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {errors?.name && <p className="text-red-600 text-sm">{errors.name[0]}</p>}
      </div>

      <div>
        <label>Email</label>
        <input
          className="w-full border rounded px-3 py-2"
          type={'email'}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {errors?.email && <p className="text-red-600 text-sm">{errors.email[0]}</p>}
      </div>

      {errors?._error && <p className="text-red-600">{errors._error}</p>}

      <div className="flex gap-3 pt-4">
        <button disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Save
        </button>

        <button
          type="button"
          onClick={() => navigate('/profile')}
          className="border px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
