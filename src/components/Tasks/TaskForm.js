import { useState } from 'react';
import styles from '../../styles/Tasks.module.css';

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
    <div style={{
      background: '#1a1a1a', 
      padding: '40px', 
      borderRadius: '15px', 
      border: '1px solid #c59d5f',
      maxWidth: '500px',
      margin: '20px auto',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#c59d5f', marginBottom: '20px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Nova Tarefa
        </h2>

        <label style={{ color: '#888', fontSize: '0.8rem', marginBottom: '8px', fontWeight: 'bold' }}>
          O QUE PRECISA SER FEITO?
        </label>
        <input 
          type="text" 
          placeholder="Ex: Estudar Next.js" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          required 
          style={{
            padding: '12px',
            background: '#111',
            border: '1px solid #333',
            borderRadius: '8px',
            color: '#fff',
            marginBottom: '20px'
          }}
        />
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#888', fontSize: '0.8rem', display: 'block', fontWeight: 'bold' }}>
            DURAÇÃO ESTIMADA (MINUTOS):
          </label>
          <input 
            type="number" 
            value={minutes} 
            onChange={(e) => setMinutes(e.target.value)} 
            min="1"
            style={{ 
              width: '100%', 
              padding: '12px', 
              marginTop: '8px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
        </div>

        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '15px', 
            background: '#c59d5f', 
            color: '#111', 
            border: 'none', 
            borderRadius: '8px', 
            fontWeight: '800', 
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: '0.3s'
          }}
          onMouseOver={(e) => e.target.style.background = '#d4af37'}
          onMouseOut={(e) => e.target.style.background = '#c59d5f'}
        >
          CRIAR TAREFA
        </button>
        
        <button 
          type="button"
          onClick={() => window.location.href="/tasks/list"} 
          style={{ 
            marginTop: '15px', 
            width: '100%', 
            border: 'none', 
            background: 'transparent', 
            color: '#888', 
            cursor: 'pointer',
            fontSize: '0.9rem',
            textDecoration: 'underline'
          }}
        >
          Ver Lista de Tarefas
        </button>
      </form>
    </div>
  );
}