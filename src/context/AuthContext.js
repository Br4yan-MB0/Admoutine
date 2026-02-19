import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser && savedUser !== "undefined") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Erro no parse do user:", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Função login corrigida: Apenas salva dados
  const login = (token, userData) => {
    if (!token || !userData) return;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    // Não fazemos router.push aqui para não bugar o redirecionamento do componente
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
