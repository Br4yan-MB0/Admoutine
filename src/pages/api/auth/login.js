import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, password } = req.body;

  // Validação simples para evitar queries desnecessárias
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  try {
    // A query já está correta usando username!
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    const user = rows[0];
    
    // Comparação do bcrypt
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    // Geração do Token - Certifique-se que JWT_SECRET está na Vercel
    const token = jwt.sign(
      { id: user.id, username: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Retorno sem a coluna 'name', conforme sua tabela
    return res.status(200).json({
      token,
      user: { 
        id: user.id, 
        username: user.username, 
        gender: user.gender, 
        nationality: user.nationality 
      }
    });
  } catch (error) {
    console.error("Erro no login:", error); // Log para você ver no painel da Vercel
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}