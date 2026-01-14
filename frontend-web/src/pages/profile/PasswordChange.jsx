import api from '../../api/axios';
import { useState } from 'react';
import { routes } from '../../routes.js';

export default function PasswordChange() {
  const [password, setPassword] = useState('');

  const submit = async e => {
    e.preventDefault();
    await api.put(routes.profile(), { password });
    alert('Password updated');
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="font-bold">Change password</h2>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button>Update</button>
    </form>
  );
}
