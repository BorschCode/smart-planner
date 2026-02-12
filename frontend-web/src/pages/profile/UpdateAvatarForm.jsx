import { useState } from 'react';
import { useProfile } from '../../profile/profileContext';

export default function AvatarForm() {
  const profile = useProfile();

  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={preview ?? profile.avatar_url}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover border"
        />

        <label className="cursor-pointer px-4 py-2 bg-gray-100 rounded-lg">
          Change avatar
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={e => {
              const file = e.target.files[0];
              if (!file) return;

              setAvatarFile(file);
              setPreview(URL.createObjectURL(file));
            }}
          />
        </label>
      </div>

      {avatarFile && <p className="text-sm text-gray-500">Selected: {avatarFile.name}</p>}
    </div>
  );
}
