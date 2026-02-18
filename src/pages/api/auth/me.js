import { verifyToken } from '../../../lib/auth';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Não autorizado' });

  try {
    // Busca o email no banco usando o ID que veio no token
    const [rows] = await pool.query('SELECT email FROM users WHERE id = ?', [user.id]);
    
    if (rows.length === 0) return res.status(404).json({ message: 'Usuário não encontrado' });

    return res.status(200).json({ email: rows[0].email });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
  }
}