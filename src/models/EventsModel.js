import pool from '../lib/db';

const EventModel = {
  async create({ userId, title, recurrence, category, description, tasks }) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [eventResult] = await connection.query(
        'INSERT INTO events (user_id, title, recurrence, category, description) VALUES (?, ?, ?, ?, ?)',
        [userId, title, recurrence || 'none', category, description || '']
      );

      const eventId = eventResult.insertId;

      if (tasks && tasks.length > 0) {
        // SQL limpo: apenas event_id e task_name
        const values = tasks.map(task => [
          eventId, 
          task.task_name
        ]);
        
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
        delete eventsMap[row.id].task_id;
        delete eventsMap[row.id].task_name;
        delete eventsMap[row.id].is_completed;
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