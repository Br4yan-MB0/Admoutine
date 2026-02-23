import { useEffect } from 'react';

export default function AlarmChecker({ routines }) {
  useEffect(() => {
    // Forçar pedido de permissão assim que entra
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const checkAlarms = () => {
      const agora = new Date();
      // Formato HH:mm (ex: "22:02")
      const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + 
                        agora.getMinutes().toString().padStart(2, '0');
      
      console.log("DEBUG: Verificando hora atual ->", horaAtual);

      routines.forEach(r => {
        // Limpa a string da base de dados para garantir que comparamos apenas "22:02"
        const routineTime = r.time ? r.time.substring(0, 5) : null;
        console.log(`DEBUG: Comparando com a rotina "${r.title}" (${routineTime})`);

        if (routineTime === horaAtual) {
          const key = `notified_${r.id}_${agora.getMinutes()}`;
          if (!localStorage.getItem(key)) {
            
            // MÉTODO 1: Alerta de Sistema (IMPOSSÍVEL BLOQUEAR)
            alert(`⏰ ALERTA ADMOUTINE: Está na hora de "${r.title}"!`);

            // MÉTODO 2: Notificação Visual (Se permitida)
            if (Notification.permission === 'granted') {
              new Notification("Admoutine", { body: `Hora de: ${r.title}` });
            }

            // MÉTODO 3: Som
            new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play();

            localStorage.setItem(key, 'true');
          }
        }
      });
    };

    // Verifica a cada 10 segundos
    const timer = setInterval(checkAlarms, 10000);
    return () => clearInterval(timer);
  }, [routines]);

  return null;
}