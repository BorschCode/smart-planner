import api from '../../api/axios';
import { useState } from 'react';

export default function EmailChange() {
  const [email, setEmail] = useState('');

  const submit = async e => {
    e.preventDefault();
    await api.put('/api/user/email', { email });
    alert('Verification email sent');
  };

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="font-bold">Change email</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button>Update</button>
    </form>
  );
}
