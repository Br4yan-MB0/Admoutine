import { verifyToken } from '../../../lib/auth';
import RoutineModel from '../../../models/RoutineModel';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);
    if (!user) return res.status(401).json({ message: 'Não autorizado' });

    if (req.method === 'GET') {
      // O DATE_FORMAT é crucial para o JavaScript conseguir comparar as horas depois
      const [routines] = await pool.query(`
        SELECT 
          r.id, 
          r.name as title, 
          DATE_FORMAT(a.alarm_time, '%H:%i') as time 
        FROM routines r
        LEFT JOIN alarms a ON r.id = a.reference_id AND a.type = 'routine'
        WHERE r.user_id = ?
      `, [user.id]);
      
      return res.status(200).json({ routines });
    }

    if (req.method === 'POST') {
      const { title, alarmTime } = req.body;
      const routineId = await RoutineModel.create({ userId: user.id, name: title });

      if (alarmTime) {
        const today = new Date().toISOString().split('T')[0];
        const fullDateTime = `${today} ${alarmTime}:00`;
        await pool.query(
          `INSERT INTO alarms (user_id, alarm_time, reference_id, type, triggered) VALUES (?, ?, ?, 'routine', 0)`,
          [user.id, fullDateTime, routineId]
        );
      }
      return res.status(201).json({ id: routineId });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno' });
  }
}