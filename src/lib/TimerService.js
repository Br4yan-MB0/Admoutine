export default class TimerService {
  static start(interval = 30000) {
    if (typeof window === 'undefined') return;

    console.log('TimerService iniciado');

    setInterval(async () => {
      try {
        const res = await fetch('/api/alarms/check');
        const data = await res.json();

        if (data.triggered && data.triggered.length > 0) {
          data.triggered.forEach(alarm => {
            alert(`⏰ Alarme disparado!\nTipo: ${alarm.type}\nRotina: ${alarm.reference_id}`);
          });
        }
      } catch (err) {
        console.error('Erro TimerService:', err);
      }
    }, interval);
  }
}
