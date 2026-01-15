import { Outlet, useLoaderData } from 'react-router-dom';
import { ProfileContext } from '../../profile/profileContext.js';

export default function ProfileLayout() {
  /** @type UserDTO */
  const profile = useLoaderData();

  return (
    <ProfileContext.Provider value={profile}>
      <Outlet />
    </ProfileContext.Provider>
  );
}
