import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { userId } = req.body; // No futuro, pegue do verifyToken

  try {
    // 1. Pega todos os treinos de hoje para salvar o progresso
    const [events] = await pool.query(`
      SELECT e.id, 
             (SELECT COUNT(*) FROM event_tasks WHERE event_id = e.id) as total,
             (SELECT COUNT(*) FROM event_tasks WHERE event_id = e.id AND is_completed = 1) as done
      FROM events e 
      WHERE e.user_id = ? AND e.category = 'workout'
    `, [userId]);

    for (let ev of events) {
      const status = ev.done === ev.total && ev.total > 0 ? 'completed' : (ev.done > 0 ? 'partial' : 'failed');

      // 2. Salva no histórico
      await pool.query(`
        INSERT INTO event_history (event_id, user_id, date, tasks_total, tasks_done, status)
        VALUES (?, ?, CURDATE(), ?, ?, ?)
      `, [ev.id, userId, ev.total, ev.done, status]);

      // 3. Reseta os checkboxes para o próximo dia
      await pool.query('UPDATE event_tasks SET is_completed = 0 WHERE event_id = ?', [ev.id]);
    }

    return res.status(200).json({ message: "Dia finalizado e histórico gerado!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}