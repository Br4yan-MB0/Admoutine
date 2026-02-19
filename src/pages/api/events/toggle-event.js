import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Não autorizado' });

  const { eventId, isCompleted } = req.body;

  try {
    // Atualiza o status do evento social (is_completed)
    const [result] = await pool.query(
      'UPDATE events SET is_completed = ? WHERE id = ? AND user_id = ?',
      [isCompleted ? 1 : 0, eventId, user.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento não encontrado' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}