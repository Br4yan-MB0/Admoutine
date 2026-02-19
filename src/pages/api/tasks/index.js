import { verifyToken } from '../../../lib/auth';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  try {
    // 1. Verifica se o usuário está logado
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Acesso negado. Token inválido.' });
    }

    // 2. BUSCAR TODAS AS TASKS (MÉTODO GET)
    if (req.method === 'GET') {
      const [rows] = await pool.query(
        'SELECT id, title, duration, status, created_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
        [user.id]
      );
      return res.status(200).json({ tasks: rows });
    }

    // 3. CRIAR NOVA TASK (MÉTODO POST)
    // 3. CRIAR NOVA TASK (MÉTODO POST)
    if (req.method === 'POST') {
      const { title, duration } = req.body;

      if (!title) {
        return res.status(400).json({ message: 'O título da tarefa é obrigatório.' });
      }

      // CORREÇÃO: Usamos aspas simples para o valor 'pending' e 
      // garantimos que o número de ? bate com o número de valores.
      const [result] = await pool.query(
        "INSERT INTO tasks (user_id, title, duration, status) VALUES (?, ?, ?, 'pending')",
        [user.id, title, duration || 60]
      );

      return res.status(201).json({ 
        message: 'Task criada com sucesso!', 
        taskId: result.insertId 
      });
    }

    // Caso tentem usar PUT, DELETE etc nesta rota principal
    return res.status(405).json({ message: 'Método não permitido.' });

  } catch (error) {
    console.error('ERRO NA API DE TASKS:', error);
    return res.status(500).json({ 
      message: 'Erro interno no servidor.', 
      details: error.message 
    });
  }
}