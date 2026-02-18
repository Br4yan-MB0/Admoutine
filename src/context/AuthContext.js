import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    } catch (err) {
      localStorage.removeItem('token');
    }

    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser(payload);
    router.push('/dashboard/home');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
