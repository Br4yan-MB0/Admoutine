import styles from '../../styles/Routine.module.css';
import { useRouter } from 'next/router';

export default function RoutineItem({ routine, onDelete }) {
  const router = useRouter();

  const formatTime = (t) => {
    if (!t) return "--:--";
    const timePart = t.includes('T') ? t.split('T')[1] : t;
    return timePart.split(':').slice(0, 2).join(':');
  };

  return (
    <div style={{
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      background: '#1a1a1a',
      padding: '12px 16px',
      borderRadius: '10px',
      border: '1px solid #332f2e',
      marginBottom: '10px',
      width: '100%'
    }}>
      
      {/* LADO ESQUERDO: Título e Hora */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3 style={{ 
          margin: 0, 
          color: '#fff', 
          fontSize: '1rem',
          fontWeight: '600' 
        }}>
          {routine.title}
        </h3>
        <span style={{ color: '#c59d5f', fontSize: '0.85rem', fontWeight: 'bold' }}>
          ⏰ {formatTime(routine.alarm_time || routine.time)}
        </span>
      </div>

      {/* LADO DIREITO: Botão Excluir */}
      <button 
        onClick={() => onDelete(routine.id)}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#444',
          cursor: 'pointer',
          fontSize: '1.2rem',
          padding: '5px',
          transition: '0.2s',
          display: 'flex',
          alignItems: 'center',
          lineHeight: '1'
        }}
        onMouseOver={(e) => e.target.style.color = '#ff4d4d'}
        onMouseOut={(e) => e.target.style.color = '#444'}
      >
        ✕
      </button>
    </div>
  );
}