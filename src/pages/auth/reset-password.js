import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Settings.module.css';

export default function ResetPassword() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: pin, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Sucesso! Faça login com a nova senha.");
      router.push('/login');
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className={styles.container} style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <div className={styles.card} style={{ border: '1px solid #c59d5f', padding: '20px' }}>
        <h2>NOVA SENHA</h2>
        <form onSubmit={handleSubmit}>
          <input 
            className={styles.inputField}
            type="text" 
            placeholder="PIN de 6 dígitos" 
            value={pin} 
            onChange={(e) => setPin(e.target.value)} 
            maxLength="6"
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <input 
            className={styles.inputField}
            type="password" 
            placeholder="Nova senha" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          />
          <button className={styles.btnPrimary} type="submit">ALTERAR SENHA</button>
        </form>
        {message && <p style={{ color: 'red' }}>{message}</p>}
      </div>
    </div>
  );
}