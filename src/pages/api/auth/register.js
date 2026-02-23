import bcrypt from 'bcryptjs'; // Recomendado usar bcryptjs para evitar erros de compilação no Vercel
import pool from '../../../lib/db';

export default async function handler(req, res) {
  // 1. Bloqueia qualquer método que não seja POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { username, email, password, gender, nationality } = req.body;

    // 2. Validação rigorosa de campos vazios
    if (!username?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Nome, E-mail e Senha são obrigatórios.' });
    }

    // 3. Criptografia da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Inserção no Banco de Dados
    // Certifica-te que os nomes das colunas (gender, nationality) estão iguais no teu MySQL
    await pool.query(
      'INSERT INTO users (username, email, password, gender, nationality) VALUES (?, ?, ?, ?, ?)',
      [
        username.trim(), 
        email.trim().toLowerCase(), // Salvar sempre em minúsculas para evitar duplicados "Falsos"
        hashedPassword, 
        gender || null, 
        nationality || null
      ]
    );

    return res.status(201).json({ message: 'Conta criada com sucesso!' });

  } catch (error) {
    // 5. Tratamento de erro de duplicados (A tua lógica estava certa, mantive e melhorei)
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        message: 'Este nome de utilizador ou e-mail já está a ser utilizado.' 
      });
    }

    console.error("Erro no Registro:", error);
    return res.status(500).json({ message: 'Erro interno ao processar o registo.' });
  }
}