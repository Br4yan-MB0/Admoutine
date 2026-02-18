// services/alarmService.js
import AlarmModel from '../models/AlarmModel';

const CHECK_INTERVAL = 5000; // a cada 5s

export default class AlarmService {
  static async checkAlarms() {
    try {
      const alarms = await AlarmModel.listPending();
      const now = new Date();

      const triggered = [];

      for (let alarm of alarms) {
        const [hours, minutes, seconds] = alarm.trigger_time.split(':').map(Number);
        const triggerDate = new Date();
        triggerDate.setHours(hours, minutes, seconds, 0);

        if (now >= triggerDate) {
          triggered.push(alarm.routine_name || alarm.task_title || `ID ${alarm.id}`);
          await AlarmModel.markTriggered(alarm.id);
        }
      }

      return triggered;
    } catch (err) {
      console.error('[AlarmService] Erro ao checar alarmes:', err);
      return [];
    }
  }
}
