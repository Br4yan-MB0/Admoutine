import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Não autorizado' });

  const { taskId, isCompleted } = req.body;

  try {
    // CORREÇÃO: Verifica se a task pertence a um evento do usuário logado
    const [result] = await pool.query(
      `UPDATE event_tasks et
       JOIN events e ON et.event_id = e.id
       SET et.is_completed = ? 
       WHERE et.id = ? AND e.user_id = ?`,
      [isCompleted ? 1 : 0, taskId, user.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou sem permissão' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}