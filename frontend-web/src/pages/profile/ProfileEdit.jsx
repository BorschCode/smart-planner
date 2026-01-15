import { useProfile } from '../../profile/profileContext.js';
import api from '../../api/axios';
import { useState } from 'react';
import { routes } from '../../routes.js';

export default function ProfileEdit() {
  /** @type UserDTO */
  const profile = useProfile();
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(null);

  const submit = async e => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', name);
    if (avatar) form.append('avatar', avatar);

    await api.post(routes.user(), form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    alert('Profile updated');
  };

  return (
    <form onSubmit={submit} className="space-y-4 bg-white p-6 rounded shadow">
      <h2 className="font-bold text-lg">Edit profile</h2>

      <input value={name} onChange={e => setName(e.target.value)} />

      <input type="file" onChange={e => setAvatar(e.target.files[0])} />

      <button className="bg-indigo-600 text-white px-4 py-2">Save</button>
    </form>
  );
}
