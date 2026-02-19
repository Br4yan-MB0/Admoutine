import pool from '../lib/db';

const TaskModel = {
  async findAllByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async create({ user_id, title, duration }) {
    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, title, duration, is_completed) VALUES (?, ?, ?, 0)',
      [user_id, title, duration]
    );
    return { id: result.insertId, user_id, title, duration };
  },

  // Método vital para o Timer funcionar:
  async markAsCompleted(id, userId) {
    await pool.query(
      'UPDATE tasks SET is_completed = 1, completed_at = NOW() WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  },

  async delete(id, userId) {
    await pool.query(
      'DELETE FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
  }
};

export default TaskModel;