import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();
  
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Não autorizado' });

  const { id } = req.query;

  try {
    // Adicionado user_id na query por segurança
    const [result] = await pool.query('DELETE FROM events WHERE id = ? AND user_id = ?', [id, user.id]);
    
    if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Evento não encontrado ou sem permissão' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}