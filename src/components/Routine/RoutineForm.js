import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RoutineForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('/api/routines', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title, alarmTime }),
      });

      if (res.ok) {
        setTitle('');
        setAlarmTime('');
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/routine'); 
        }
      } else {
        alert("Erro ao salvar rotina.");
      }
    } catch (error) {
      console.error("Erro no formulário:", error);
    }
  };

  return (
    <div style={{
      background: '#1a1a1a', 
      padding: '40px', 
      borderRadius: '15px', 
      border: '1px solid #c59d5f',
      maxWidth: '500px',
      margin: '40px auto',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ 
          color: '#c59d5f', 
          marginBottom: '30px', 
          textAlign: 'center', 
          textTransform: 'uppercase', 
          letterSpacing: '2px',
          fontSize: '1.4rem'
        }}>
          Nova Atividade
        </h2>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#888', fontSize: '0.75rem', marginBottom: '8px', display: 'block', fontWeight: '800' }}>
            O QUE VAMOS FAZER?
          </label>
          <input 
            style={{
              width: '100%',
              padding: '12px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem'
            }}
            type="text" 
            placeholder="Ex: Treino de Perna..." 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ color: '#888', fontSize: '0.75rem', marginBottom: '8px', display: 'block', fontWeight: '800' }}>
            HORÁRIO DO ALARME
          </label>
          <input 
            style={{
              width: '100%',
              padding: '12px',
              background: '#111',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1.1rem' // Um pouco maior para facilitar a leitura do tempo
            }}
            type="time" 
            value={alarmTime} 
            onChange={(e) => setAlarmTime(e.target.value)} 
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button 
            type="submit" 
            style={{ 
              padding: '15px', 
              background: '#c59d5f', 
              color: '#111', 
              border: 'none', 
              borderRadius: '30px', 
              fontWeight: '800', 
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: '0.3s',
              fontSize: '0.9rem'
            }}
            onMouseOver={(e) => e.target.style.background = '#d4af37'}
            onMouseOut={(e) => e.target.style.background = '#c59d5f'}
          >
            Confirmar Rotina
          </button>
          
          <button 
            type="button" 
            onClick={() => router.push('/dashboard/home')}
            style={{ 
              background: 'transparent', 
              color: '#888', 
              border: '1px solid #332f2e', 
              padding: '12px', 
              borderRadius: '30px', 
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: '0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#fff';
              e.target.style.borderColor = '#c59d5f';
            }}
            onMouseOut={(e) => {
              e.target.style.color = '#888';
              e.target.style.borderColor = '#332f2e';
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}