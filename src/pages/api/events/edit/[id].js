import pool from '../../../../lib/db';
import { verifyToken } from '../../../../lib/auth';

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Não autorizado' });

  const { id } = req.query;

  // GET: Busca os dados para preencher o form
  if (req.method === 'GET') {
    try {
      const [event] = await pool.query('SELECT * FROM events WHERE id = ? AND user_id = ?', [id, user.id]);
      if (event.length === 0) return res.status(404).json({ message: 'Evento não encontrado' });

      const [tasks] = await pool.query('SELECT id, task_name, is_completed FROM event_tasks WHERE event_id = ?', [id]);
      
      return res.status(200).json({ ...event[0], tasks });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // PUT: Atualiza o evento e as tarefas
  if (req.method === 'PUT') {
    const { title, description, category, recurrence, tasks } = req.body;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Atualiza dados básicos do evento
      await connection.query(
        'UPDATE events SET title = ?, description = ?, category = ?, recurrence = ? WHERE id = ? AND user_id = ?',
        [title, description, category, recurrence, id, user.id]
      );

      // 2. Sincroniza tarefas (o jeito mais seguro: apaga as antigas e insere as novas)
      await connection.query('DELETE FROM event_tasks WHERE event_id = ?', [id]);
      
      if (tasks && tasks.length > 0) {
        const values = tasks.map(t => [id, t.task_name, t.is_completed || 0]);
        await connection.query('INSERT INTO event_tasks (event_id, task_name, is_completed) VALUES ?', [values]);
      }

      await connection.commit();
      return res.status(200).json({ message: 'Evento atualizado com sucesso' });
    } catch (error) {
      await connection.rollback();
      return res.status(500).json({ error: error.message });
    } finally {
      connection.release();
    }
  }
}