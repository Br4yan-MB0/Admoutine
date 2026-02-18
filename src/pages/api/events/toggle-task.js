// src/pages/api/events/toggle-task.js
import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { taskId, isCompleted } = req.body;

  try {
    await pool.query(
      'UPDATE event_tasks SET is_completed = ? WHERE id = ?',
      [isCompleted ? 1 : 0, taskId]
    );
    return res.status(200).json({ message: 'Atualizado' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}