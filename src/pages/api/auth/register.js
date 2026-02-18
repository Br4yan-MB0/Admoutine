import bcrypt from 'bcrypt';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    let { username, email, password, gender, nationality } = req.body;

    // Limpeza e normalização
    username = username?.trim();
    email = email?.trim().toLowerCase();
    password = password?.trim();
    gender = gender?.trim();
    nationality = nationality?.trim();

    // Validação robusta
    if (!username || !email || !password || !gender || !nationality) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios, incluindo gênero e nacionalidade.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    // Verifica se o email já existe
    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere no banco com os novos slots
    await pool.query(
      'INSERT INTO users (name, email, password, gender, nationality) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, gender, nationality]
    );

    return res.status(201).json({ message: 'Usuário registrado com sucesso!' });

  } catch (error) {
    console.error('ERRO NO REGISTRO:', error);
    return res.status(500).json({ message: 'Erro crítico ao salvar usuário.' });
  }
}