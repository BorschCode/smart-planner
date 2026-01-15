import { createContext, useContext, useEffect, useState } from 'react';
import api, { initCsrf } from '../api/axios';
import { routes } from '../routes.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const { data } = await api.get(routes.user());
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    api
      .get(routes.user())
      .then(res => {
        if (mounted) setUser(res.data);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    await initCsrf();
    const response = await api.post(routes.login(), { email, password });

    // Check if 2FA is required
    if (response.data.two_factor) {
      return { requiresTwoFactor: true };
    }

    await refreshUser();
    return { requiresTwoFactor: false };
  };

  const logout = async () => {
    await api.post(routes.logout());
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
