import AlarmModel from '../../../models/AlarmModel';

export default async function handler(req, res) {

  try {
    const alarms = await AlarmModel.listPending();
    const now = new Date();

    let triggeredAlarms = [];

    for (let alarm of alarms) {

      const alarmDate = new Date(alarm.alarm_time);

      if (alarmDate <= now) {

        triggeredAlarms.push(alarm);

        await AlarmModel.markTriggered(alarm.id);
      }
    }

    res.status(200).json({
      success: true,
      triggered: triggeredAlarms
    });

  } catch (error) {
    console.error('Erro ao checar alarmes:', error);
    res.status(500).json({ error: 'Erro interno' });
  }

}
