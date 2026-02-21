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

    // Proteção contra "undefined" em string, comum quando a API falha
    if (token && savedUser && savedUser !== "undefined" && savedUser !== "null") {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Erro no parse do user:", err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    if (!token || !userData) {
        console.error("Login falhou: Token ou UserData ausentes");
        return;
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    // AJUSTE DE ROTA: Verifique se sua pasta é /dashboard ou /dashboard/home
    // Vou colocar /dashboard que é o padrão mais comum.
    router.push('/dashboard'); 
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);