// src/components/AlarmManager.js
import { useEffect } from 'react';

export default function AlarmManager({ routines }) {
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      routines.forEach(routine => {
        // Se a hora atual bater com a hora da rotina
        if (routine.time === currentTime) {
          playAlarmSound(routine.title);
        }
      });
    };

    const interval = setInterval(checkAlarms, 60000); // Checa a cada 1 minuto
    return () => clearInterval(interval);
  }, [routines]);

  const playAlarmSound = (title) => {
    const audio = new Audio('/sounds/gold-bell.mp3'); // Você precisará desse arquivo na pasta public
    audio.play();
    alert(`🏆 HORA DO OURO: ${title}`); 
    // Depois vamos trocar esse alert por um Toast elegante
  };

  return null; // Componente invisível
}