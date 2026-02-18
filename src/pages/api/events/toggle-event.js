import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { eventId, isCompleted } = req.body;

  try {
    await pool.query(
      'UPDATE events SET is_completed = ? WHERE id = ?',
      [isCompleted ? 1 : 0, eventId]
    );
    return res.status(200).json({ message: 'Sucesso' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}