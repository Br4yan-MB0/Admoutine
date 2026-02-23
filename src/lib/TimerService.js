export default class TimerService {
  static start(interval = 20000) { // Verifica a cada 20 segundos
    if (typeof window === 'undefined') return;

    console.log('Foguete de alarmes iniciado...');

    setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/alarms/check', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        if (data.triggered && data.triggered.length > 0) {
          data.triggered.forEach(alarm => {
            // SOM
            new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
            
            // NOTIFICAÇÃO DE SISTEMA
            if (Notification.permission === 'granted') {
              new Notification("ADMOUTINE", { body: `Está na hora de: ${alarm.title}` });
            }

            // ALERT (O QUE TU VES NO ECRÃ)
            alert(`⏰ HORA DA ROTINA: ${alarm.title}`);
          });
        }
      } catch (err) {
        console.error('Erro no Timer:', err);
      }
    }, interval);
  }
}