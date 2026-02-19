import { verifyToken } from '../../../lib/auth';
import pool from '../../../lib/db';

export default async function handler(req, res) {
  try {
    // 1. Validar o Token
    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const { id } = req.query;

    // 2. Método DELETE (Para o botão da lixeira funcionar)
    if (req.method === 'DELETE') {
      const [result] = await pool.query(
        'DELETE FROM tasks WHERE id = ? AND user_id = ?',
        [id, user.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence ao usuário' });
      }

      return res.status(200).json({ message: 'Tarefa removida com sucesso' });
    }

    // 3. Método PUT (Caso queira atualizar status ou título depois)
    if (req.method === 'PUT') {
      const { title, duration, status } = req.body;
      
      // Buscamos os dados atuais da task para não sobrescrever com NULL
      const [currentTask] = await pool.query(
        'SELECT title, duration, status FROM tasks WHERE id = ? AND user_id = ?',
        [id, user.id]
      );

      if (currentTask.length === 0) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
      }

      // Se o campo não veio no body, usamos o que já está no banco
      const finalTitle = title !== undefined ? title : currentTask[0].title;
      const finalDuration = duration !== undefined ? duration : currentTask[0].duration;
      const finalStatus = status !== undefined ? status : currentTask[0].status;

      await pool.query(
        'UPDATE tasks SET title = ?, duration = ?, status = ? WHERE id = ? AND user_id = ?',
        [finalTitle, finalDuration, finalStatus, id, user.id]
      );

      return res.status(200).json({ message: 'Tarefa atualizada com sucesso' });
    }

    // Caso usem um método não tratado (ex: POST nesta rota)
    return res.status(405).json({ message: 'Método não permitido' });

  } catch (error) {
    console.error('Erro na API Task ID:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}