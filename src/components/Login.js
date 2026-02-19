import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Settings.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

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
      login(data.token, data.user); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container} style={{ maxWidth: '400px', display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
      <div className={styles.card} style={{ width: '100%', border: '1px solid #c59d5f' }}>
        <h2 className={styles.title} style={{ fontSize: '1.8rem', marginBottom: '10px' }}>LOGIN</h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px', fontSize: '0.9rem', letterSpacing: '1px' }}>
          CHROUTINE: O LUXO DA ROTINA
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Nome de Usuário"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder="Sua Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button className={styles.btnPrimary} style={{ marginTop: '10px' }} type="submit">
            ENTRAR NO PAINEL
          </button>
        </form>

        {error && <p style={{ color: '#ff4d4d', textAlign: 'center', marginTop: '15px', fontSize: '0.85rem' }}>{error}</p>}

        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.85rem', color: '#888' }}>
          Novo por aqui? <a href="/register" style={{ color: '#c59d5f', fontWeight: 'bold', textDecoration: 'none' }}>Crie sua conta</a>
        </p>
      </div>
    </div>
  );
}