import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  let { email, password } = req.body;
  email = email?.trim().toLowerCase();
  password = password?.trim();

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  try {
    // Busca usuário incluindo os novos campos para o contexto
    const [rows] = await pool.query(
      'SELECT id, name, email, password, gender, nationality FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = rows[0];

    // Compara hash
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gera token JWT com expiração de 7 dias
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login autorizado',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        nationality: user.nationality
      },
    });

  } catch (error) {
    console.error('ERRO NO LOGIN:', error);
    return res.status(500).json({ message: 'Falha na autenticação do servidor' });
  }
}