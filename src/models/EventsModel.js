import pool from '../lib/db';

const EventModel = {
  async create({ userId, title, recurrence, category, description, tasks }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // LÓGICA DE EXPIRAÇÃO: Se for social, soma 2 horas à hora atual
      const expiresAt = category === 'social' 
        ? new Date(Date.now() + 2 * 60 * 60 * 1000) 
        : null;

      const [eventResult] = await connection.query(
        'INSERT INTO events (user_id, title, recurrence, category, description, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, title, recurrence || 'none', category, description || '', expiresAt]
      );

      const eventId = eventResult.insertId;

      // Só insere tarefas se for treino e houver tarefas
      if (category === 'workout' && tasks && tasks.length > 0) {
        const values = tasks.map(task => [eventId, task.task_name]);
        await connection.query(
          'INSERT INTO event_tasks (event_id, task_name) VALUES ?',
          [values]
        );
      }

      await connection.commit();
      return eventId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getAllByUser(userId) {
    const [rows] = await pool.query(`
      SELECT 
        e.*, 
        t.id as task_id, 
        t.task_name, 
        t.is_completed
      FROM events e
      LEFT JOIN event_tasks t ON e.id = t.event_id
      WHERE e.user_id = ?
      ORDER BY e.id DESC
    `, [userId]);

    const eventsMap = {};
    rows.forEach(row => {
      if (!eventsMap[row.id]) {
        eventsMap[row.id] = { ...row, tasks: [] };
      }
      if (row.task_id) {
        eventsMap[row.id].tasks.push({
          id: row.task_id,
          task_name: row.task_name,
          is_completed: row.is_completed,
        });
      }
    });
    return Object.values(eventsMap);
  }
};

export default EventModel;