import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import styles from '../styles/Settings.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  // Se o usuário já estiver logado, manda direto pro Home
  useEffect(() => {
    if (user) {
      router.replace('/dashboard/home');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Credenciais incorretas');

      // 1. Atualiza o contexto
      login(data.token, data.user); 
      
      // O useEffect acima cuidará do redirecionamento assim que o 'user' for setado
      // Mas por segurança, forçamos aqui também:
      router.push('/dashboard/home');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container} style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
      <div className={styles.card} style={{ width: '100%', border: '1px solid #c59d5f' }}>
        <h2 className={styles.title}>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <input className={styles.inputField} type="text" placeholder="Usuário" value={username} onChange={e => setUsername(e.target.value)} required />
          <input className={styles.inputField} type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} required />
          <button className={styles.btnPrimary} type="submit">ENTRAR</button>
        </form>
        {error && <p style={{ color: '#ff4d4d', textAlign: 'center', marginTop: '10px' }}>{error}</p>}
      </div>
    </div>
  );
}
