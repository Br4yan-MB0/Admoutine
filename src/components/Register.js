import { useState } from 'react';
import styles from '../styles/Settings.module.css'; // Usando a base de inputs elegantes

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    gender: '',
    nationality: ''
  });
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
        body: JSON.stringify({
          ...formData,
          email: formData.email.trim().toLowerCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Erro ao registrar');
        return;
      }

      setMessage('Conta dourada criada! Redirecionando para login...');
      setFormData({ username: '', email: '', password: '', gender: '', nationality: '' });
      
      // Pequeno delay para o user ler a mensagem de sucesso
      setTimeout(() => { window.location.href = '/login'; }, 2000);
      
    } catch (err) {
      setError('Erro de conexão com o servidor');
    }
  };

  return (
    <div className={styles.container} style={{maxWidth: '450px', marginTop: '10vh'}}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle} style={{textAlign: 'center', fontSize: '1.8rem'}}>Criar Conta</h2>
        <p style={{textAlign: 'center', color: 'var(--text-s)', marginBottom: '20px'}}>Junte-se ao Admoutine</p>

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
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />

          <input
            className={styles.inputField}
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <select 
              className={styles.inputField}
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

          <button className={styles.btnPrimary} style={{width: '100%', marginTop: '10px'}} type="submit">
            Registrar
          </button>
        </form>

        {error && <p style={{color: 'var(--danger)', textAlign: 'center', marginTop: '10px'}}>{error}</p>}
        {message && <p style={{color: 'var(--success)', textAlign: 'center', marginTop: '10px'}}>{message}</p>}
        
        <p style={{textAlign: 'center', marginTop: '20px', fontSize: '0.9rem'}}>
          Já tem conta? <a href="/login" style={{color: 'var(--text-p)', fontWeight: 'bold'}}>Faça Login</a>
        </p>
      </div>
    </div>
  );
}