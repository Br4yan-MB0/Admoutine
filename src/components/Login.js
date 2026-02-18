import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/Settings.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
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
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Credenciais incorretas');
        return;
      }

      login(data.token);
    } catch (err) {
      setError('Falha na comunicação com o servidor');
    }
  };

  return (
    <div className={styles.container} style={{maxWidth: '400px', marginTop: '15vh'}}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle} style={{textAlign: 'center', fontSize: '1.8rem'}}>Login</h2>
        <p style={{textAlign: 'center', color: 'var(--text-s)', marginBottom: '20px'}}>Bem-vindo de volta ao luxo da rotina</p>

        <form onSubmit={handleSubmit}>
          <input
            className={styles.inputField}
            type="email"
            placeholder="Seu Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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

          <button className={styles.btnPrimary} style={{width: '100%', marginTop: '10px'}} type="submit">
            Entrar no Painel
          </button>
        </form>

        {error && (
          <div style={{
            background: 'rgba(231, 76, 60, 0.1)', 
            border: '1px solid var(--danger)', 
            padding: '10px', 
            borderRadius: '8px', 
            marginTop: '15px',
            color: 'var(--danger)',
            textAlign: 'center',
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        <p style={{textAlign: 'center', marginTop: '20px', fontSize: '0.9rem'}}>
          Novo por aqui? <a href="/register" style={{color: 'var(--text-p)', fontWeight: 'bold'}}>Crie sua conta</a>
        </p>
      </div>
    </div>
  );
}