import { useState } from 'react';
import styles from '../../styles/CalendarGrid.module.css';

export default function CalendarGrid({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normaliza hoje

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDay = (day) => {
    const dateToCheck = new Date(year, month, day).setHours(0, 0, 0, 0);
    
    return events.filter(event => {
      // Normaliza a data de criação do evento para comparação pura
      const eventDate = new Date(event.created_at).setHours(0, 0, 0, 0);
      const type = event.recurrence; 

      if (type === 'none' || !type) {
        return eventDate === dateToCheck;
      }
      
      // Lógica de recorrência protegida por data de início
      if (type === 'daily') return dateToCheck >= eventDate;
      if (type === 'weekly') {
        return dateToCheck >= eventDate && new Date(dateToCheck).getDay() === new Date(eventDate).getDay();
      }
      if (type === 'monthly') {
        return dateToCheck >= eventDate && new Date(dateToCheck).getDate() === new Date(eventDate).getDate();
      }
      return false;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => setCurrentDate(new Date(year, month - 1))} className={styles.navBtn}>◀</button>
        <h2 className={styles.monthTitle}>
          {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => setCurrentDate(new Date(year, month + 1))} className={styles.navBtn}>▶</button>
      </div>

      <div className={styles.grid}>
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
          <div key={d} className={styles.weekDay}>{d}</div>
        ))}
        
        {blanks.map(b => <div key={`b-${b}`} className={styles.blank} />)}
        
        {days.map(day => {
          const dateInstance = new Date(year, month, day).setHours(0,0,0,0);
          const isToday = dateInstance === today.getTime();
          const dayEvents = getEventsForDay(day);

          return (
            <div key={day} className={`${styles.dayBox} ${isToday ? styles.today : ''}`}>
              <span className={styles.dayNumber}>{day}</span>
              <div className={styles.dotContainer}>
                {dayEvents.map((ev, idx) => (
                  <div 
                    key={idx} 
                    title={ev.title}
                    className={`${styles.dot} ${ev.category === 'workout' ? styles.dotWorkout : styles.dotSocial}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}