// pages/api/alarms/check.js
import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);
    if (!user) return res.status(401).json({ message: 'Não autorizado' });

    const agora = new Date();
    // Formata a hora atual para bater com o banco (HH:mm)
    const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + 
                      agora.getMinutes().toString().padStart(2, '0');

    // Procura alarmes para este minuto que ainda não foram disparados
    const [alarms] = await pool.query(`
      SELECT a.id, r.name as title, a.type 
      FROM alarms a
      JOIN routines r ON a.reference_id = r.id
      WHERE a.user_id = ? 
      AND DATE_FORMAT(a.alarm_time, '%H:%i') = ?
      AND a.triggered = 0
    `, [user.id, horaAtual]);

    if (alarms.length > 0) {
      // Marca como disparado para não repetir no próximo segundo
      const ids = alarms.map(a => a.id);
      await pool.query('UPDATE alarms SET triggered = 1 WHERE id IN (?)', [ids]);
    }

    return res.status(200).json({ triggered: alarms });
  } catch (error) {
    return res.status(500).json({ triggered: [] });
  }
}