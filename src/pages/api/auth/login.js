import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      token,
      user: { id: user.id, username: user.username, gender: user.gender, nationality: user.nationality }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
}