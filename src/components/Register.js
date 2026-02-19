import { useState } from 'react';
import styles from '../styles/Settings.module.css';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', password: '', gender: '', nationality: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao registrar');
      setMessage('Conta criada com sucesso!');
      setTimeout(() => { window.location.href = '/login'; }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container} style={{ maxWidth: '450px', display: 'flex', alignItems: 'center', minHeight: '90vh' }}>
      <div className={styles.card} style={{ width: '100%', border: '1px solid #c59d5f' }}>
        <h2 className={styles.title} style={{ fontSize: '1.8rem', marginBottom: '10px' }}>CRIAR CONTA</h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px', fontSize: '0.9rem' }}>JUNTE-SE À ELITE DA PRODUTIVIDADE</p>

        <form onSubmit={handleSubmit}>
          <input
            className={styles.inputField}
            placeholder="Nome de usuário"
            value={formData.username}
            onChange={e => setFormData({...formData, username: e.target.value})}
            required
          />
          <input
            className={styles.inputField}
            type="password"
            placeholder="Senha (mín. 6 caracteres)"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <select 
              className={styles.inputField}
              style={{ color: formData.gender ? '#fff' : '#888' }}
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}
              required
            >
              <option value="">Gênero</option>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
            <input
              className={styles.inputField}
              placeholder="Nacionalidade"
              value={formData.nationality}
              onChange={e => setFormData({...formData, nationality: e.target.value})}
              required
            />
          </div>
          <button className={styles.btnPrimary} style={{ marginTop: '10px' }} type="submit">
            REGISTRAR AGORA
          </button>
        </form>

        {error && <p style={{ color: '#ff4d4d', textAlign: 'center', marginTop: '15px' }}>{error}</p>}
        {message && <p style={{ color: '#c59d5f', textAlign: 'center', marginTop: '15px' }}>{message}</p>}
        
        <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '0.85rem', color: '#888' }}>
          Já tem conta? <a href="/login" style={{ color: '#c59d5f', fontWeight: 'bold', textDecoration: 'none' }}>Faça Login</a>
        </p>
      </div>
    </div>
  );
}