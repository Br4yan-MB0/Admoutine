import pool from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send();

  const { token, newPassword } = req.body; // 'token' aqui será o PIN de 6 dígitos

  try {
    // Verifica se o PIN é válido e não expirou
    const [users] = await pool.query(
      'SELECT id FROM users WHERE reset_token = ? AND reset_expires > NOW()',
      [token]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: 'PIN inválido ou expirado' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha e limpa os campos de reset
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
      [hashedPassword, users[0].id]
    );

    return res.status(200).json({ message: 'Password atualizada com sucesso!' });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao redefinir password' });
  }
}