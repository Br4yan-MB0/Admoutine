import { useState } from 'react';
import styles from '../../styles/Tasks.module.css'; // Certifique-se de que o caminho está correto

export default function TaskForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [minutes, setMinutes] = useState(25);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const durationInSeconds = parseInt(minutes) * 60;

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ 
        title, 
        duration: durationInSeconds 
      }),
    });

    if (res.ok) {
      setTitle('');
      setMinutes(25);
      if (onSuccess) onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.timerWrapper} style={{textAlign: 'left'}}>
      <label className={styles.label}>O que precisa ser feito?</label>
      <input 
        type="text" 
        placeholder="Ex: Estudar Next.js" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
        className={styles.inputField}
      />
      
      <div style={{ marginBottom: '20px' }}>
        <label className={styles.label}>Duração (minutos): </label>
        <input 
          type="number" 
          value={minutes} 
          onChange={(e) => setMinutes(e.target.value)} 
          min="1"
          className={styles.inputField}
          style={{ width: '80px', marginTop: '10px' }}
        />
      </div>

      <button type="submit" className={styles.btnAction} style={{ width: '100%' }}>
        CRIAR TAREFA
      </button>
      
      <button 
        type="button"
        onClick={() => window.location.href="/tasks/list"} 
        className={styles.backBtn}
        style={{ marginTop: '15px', width: '100%', border: 'none', background: 'transparent', color: 'var(--text-s)', cursor: 'pointer'}}
      >
        Ver Lista de Tarefas
      </button>
    </form>
  );
}