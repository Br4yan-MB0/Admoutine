import { useRouter } from 'next/router';
import styles from '../../styles/Card.module.css';

export default function EventCard({ event, onUpdate }) {
  const router = useRouter();
  if (!event) return null;

  const isWorkout = event.category === 'workout';
  const isEventDone = !!event.is_completed;

  // Lógica para calcular se expirou ou quanto tempo falta (opcional para o visual)
  const isExpired = event.expires_at && new Date(event.expires_at) < new Date();

  const handleDelete = async () => {
    if (confirm("Deseja excluir este evento?")) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`/api/events/delete?id=${event.id}`, { 
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok && typeof onUpdate === 'function') onUpdate();
      } catch (error) { console.error("Erro ao deletar:", error); }
    }
  };

  const handleToggle = async (id, newState, type = 'task') => {
    const token = localStorage.getItem("token");
    const endpoint = type === 'task' ? '/api/events/toggle-task' : '/api/events/toggle-event';
    const body = type === 'task' ? { taskId: id, isCompleted: newState } : { eventId: id, isCompleted: newState };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(body)
      });
      if (res.ok && typeof onUpdate === 'function') onUpdate();
    } catch (error) { console.error("Erro ao atualizar:", error); }
  };

  return (
    <div className={`${styles.card} ${isWorkout ? styles.workoutBorder : styles.socialBorder}`}>
      <div className={styles.cardHeader}>
        <div>
          <h3 className={`${styles.title} ${isWorkout ? styles.textWorkout : styles.textSocial}`}>
            {event.title}
          </h3>
          <span className={styles.categoryLabel}>
            {isWorkout ? '🏋️ Treino' : '📅 Evento Social'}
          </span>
        </div>
        {/* Tag de Expiração para Social */}
        {!isWorkout && (
          <span className={styles.expireTag}>
            {isExpired ? "Expirado" : "Temporário"}
          </span>
        )}
      </div>

      <div className={styles.cardContent}>
        {isWorkout ? (
          <div className={styles.taskList}>
            {event.tasks?.map((task, idx) => (
              <div key={task.id || idx} className={styles.taskRow}>
                <input 
                  type="checkbox" 
                  checked={!!task.is_completed} 
                  onChange={(e) => handleToggle(task.id, e.target.checked, 'task')} 
                  className={styles.checkbox}
                />
                <span className={`${styles.taskName} ${task.is_completed ? styles.completed : ''}`}>
                  {task.task_name}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.socialBox}>
             <div className={styles.taskRow}>
                {/* REMOVIDO O CHECKBOX AQUI PARA SOCIAL */}
                <p className={styles.descriptionBox}>
                  {event.description || "Nenhuma descrição."}
                </p>
             </div>
          </div>
        )}
      </div>

      <div className={styles.eventActions}>
        <button onClick={() => router.push(`/calendar/edit/${event.id}`)} className={styles.iconBtn}>✏️</button>
        <button onClick={handleDelete} className={`${styles.iconBtn} ${styles.deleteBtn}`}>🗑️</button>
      </div>
    </div>
  );
}