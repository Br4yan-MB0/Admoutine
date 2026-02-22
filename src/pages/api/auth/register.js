import bcrypt from 'bcrypt';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { username, email, password, gender, nationality } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ message: 'Preencha os campos obrigatórios.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Query atualizada com o campo EMAIL
    await pool.query(
      'INSERT INTO users (username, email, password, gender, nationality) VALUES (?, ?, ?, ?, ?)',
      [username.trim(), email.trim(), hashedPassword, gender, nationality]
    );

    return res.status(201).json({ message: 'Conta criada com sucesso!' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Usuário ou E-mail já registrado.' });
    }
    return res.status(500).json({ message: 'Erro ao registrar.' });
  }
}