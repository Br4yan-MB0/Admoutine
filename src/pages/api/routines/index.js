import { verifyToken } from '../../../lib/auth';
import RoutineModel from '../../../models/RoutineModel';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({ message: 'Token inválido ou ausente' });
    }

    if (req.method === 'GET') {
  // Pegamos o nome da rotina e o texto da hora que está lá na outra tabela
  const [routines] = await pool.query(`
    SELECT r.id, r.name as title, a.alarm_time as time 
    FROM routines r
    LEFT JOIN alarms a ON r.id = a.reference_id AND a.type = 'routine'
    WHERE r.user_id = ?
  `, [user.id]);

  return res.status(200).json({ routines });
}

    if (req.method === 'POST') {
      const { title, description, alarmTime } = req.body;

      if (!title) {
        return res.status(400).json({ message: 'Título é obrigatório' });
      }

      const routineId = await RoutineModel.create({
        userId: user.id,
        name: title,
        description
      });

      if (alarmTime) {
  // Pega a data de hoje no formato YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];
  // Combina com a hora: '2026-02-18 05:18:00'
  const fullDateTime = `${today} ${alarmTime}:00`;

  await pool.query(
    `INSERT INTO alarms (user_id, alarm_time, reference_id, type, triggered)
     VALUES (?, ?, ?, 'routine', 0)`,
    [user.id, fullDateTime, routineId]
  );
}

      return res.status(201).json({ id: routineId });
    }

    return res.status(405).json({ message: 'Método não permitido' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}
