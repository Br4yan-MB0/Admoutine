import { verifyToken } from '../../../lib/auth';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Unauthorized' });

  const { id } = req.query;

  // BUSCAR UMA ÚNICA ROTINA (Para carregar no formulário de Edit)
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query(`
        SELECT r.name as title, a.alarm_time as time 
        FROM routines r
        LEFT JOIN alarms a ON r.id = a.reference_id AND a.type = 'routine'
        WHERE r.id = ? AND r.user_id = ?
      `, [id, user.id]);
      
      if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
      return res.status(200).json({ routine: rows[0] });
    } catch (e) { return res.status(500).json({ message: 'Error' }); }
  }

  // ATUALIZAR ROTINA (O Edit em si)
  if (req.method === 'PUT') {
    const { title, alarmTime } = req.body;
    try {
      await pool.query('UPDATE routines SET name = ? WHERE id = ? AND user_id = ?', [title, id, user.id]);
      await pool.query('UPDATE alarms SET alarm_time = ? WHERE reference_id = ? AND type = "routine"', [alarmTime, id]);
      return res.status(200).json({ message: 'Updated' });
    } catch (e) { return res.status(500).json({ message: 'Update error' }); }
  }

  if (req.method === 'DELETE') {
    try {
      await pool.query('DELETE FROM routines WHERE id = ? AND user_id = ?', [id, user.id]);
      return res.status(200).json({ message: 'Deleted' });
    } catch (error) { return res.status(500).json({ message: 'Error' }); }
  }

  return res.status(405).send();
}