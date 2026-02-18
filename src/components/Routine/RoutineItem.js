import styles from '../../styles/Routine.module.css';
import { useRouter } from 'next/router';

export default function RoutineItem({ routine, onDelete }) {
  const router = useRouter();

  // Função para limpar strings como "2026-02-18T05:50"
  const formatTime = (t) => {
    if (!t) return "--:--";
    const timePart = t.includes('T') ? t.split('T')[1] : t;
    return timePart.split(':').slice(0, 2).join(':');
  };

  return (
    <div className={styles.routineCard}>
      <div className={styles.routineInfo}>
        <h3>{routine.title}</h3>
        <span>⏰ {formatTime(routine.alarm_time || routine.time)}</span>
      </div>
      
      <div className={styles.cardActions}>
        <button 
          className={styles.iconBtn}
          onClick={() => router.push(`/routine/edit/${routine.id}`)}
          title="Editar"
        >
          ✏️
        </button>
        <button 
          className={`${styles.iconBtn} ${styles.deleteBtn}`}
          onClick={() => onDelete(routine.id)} 
          title="Excluir"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}