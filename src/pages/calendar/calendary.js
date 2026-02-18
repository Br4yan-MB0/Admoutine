import { useState, useEffect } from 'react';
import CalendarGrid from '../../components/Calendar/CalendarGrid';
import EventCard from '../../components/Calendar/EventCard';
import NewEventModal from '../../components/Calendar/NewEventModal';
import styles from '../../styles/Calendar.module.css';

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Falha ao buscar');
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      setEvents([]);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  // --- FILTRAGEM CORRIGIDA ---
  // Pendentes: Treinos com tarefas abertas OU Sociais com is_completed = 0
  const pendingEvents = events.filter(e => {
    if (e.category === 'workout') {
      return e.tasks && e.tasks.length > 0 && e.tasks.some(t => !t.is_completed);
    }
    return !e.is_completed;
  });
  
  // Concluídos: Treinos com todas as tarefas feitas OU Sociais com is_completed = 1
  const completedEvents = events.filter(e => {
    if (e.category === 'workout') {
      return e.tasks && e.tasks.length > 0 && e.tasks.every(t => t.is_completed);
    }
    return !!e.is_completed;
  });

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Calendário de Rotina</h1>
        <button onClick={() => setShowModal(true)} className={styles.addBtn}>+ Novo Evento</button>
      </header>

      <CalendarGrid events={events} />

      <hr className={styles.divider} />

      <div className={styles.listContainer}>
        <h2 className={styles.sectionTitle}>Seus Compromissos</h2>
        {pendingEvents.length === 0 ? (
          <p className={styles.emptyText}>Tudo limpo por aqui!</p>
        ) : (
          pendingEvents.map(event => (
            <EventCard key={event.id} event={event} onUpdate={fetchEvents} />
          ))
        )}

        {completedEvents.length > 0 && (
          <div className={styles.completedSection}>
            <h2 className={styles.completedTitle}>Concluídos ✅</h2>
            <div className={styles.completedList}>
              {completedEvents.map(event => (
                <EventCard key={event.id} event={event} onUpdate={fetchEvents} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <NewEventModal 
          onClose={() => { setShowModal(false); fetchEvents(); }} 
        />
      )}
    </div>
  );
}