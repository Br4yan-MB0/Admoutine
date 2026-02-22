import { useState } from 'react';
import { useRouter } from 'next/router'; // 1. Importar o router
import styles from '../../styles/Settings.module.css'; 

export default function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter(); // 2. Inicializar o router

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('A processar...');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      
      const data = await res.json();

      if (res.ok) {
        // 3. Se enviou com sucesso, vai para a página do PIN
        setMessage('Código enviado! A redirecionar...');
        setTimeout(() => {
          router.push('/auth/reset-password');
        }, 2000); // Dá 2 segundos para o user ler a mensagem
      } else {
        setMessage(data.message || 'Erro ao enviar código.');
      }
    } catch (err) {
      setMessage('Erro de conexão.');
    }
  };

  return (
    <div className={styles.container} style={{ maxWidth: '450px', margin: '100px auto' }}>
      <div className={styles.card} style={{ border: '1px solid #c59d5f', textAlign: 'center', padding: '20px' }}>
        <h2 className={styles.title}>RECUPERAR ACESSO</h2>
        <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '20px' }}>
          Insira o seu username para receber o código no e-mail.
        </p>
        <form onSubmit={handleSubmit}>
          <input 
            className={styles.inputField}
            type="text" 
            placeholder="Nome de Utilizador" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
            style={{ width: '100%', padding: '12px', marginBottom: '15px', boxSizing: 'border-box' }}
          />
          <button className={styles.btnPrimary} type="submit" style={{ width: '100%' }}>
            GERAR CÓDIGO
          </button>
        </form>
        {message && (
          <p style={{ 
            color: message.includes('Erro') ? '#ff4d4d' : '#c59d5f', 
            marginTop: '15px',
            fontSize: '0.9rem' 
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}