import { createContext, useContext } from 'react';

export const ProfileContext = createContext(null);

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used inside <ProfileLayout>');
  return ctx;
};
