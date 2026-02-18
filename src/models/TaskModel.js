import pool from '../lib/db';

const TaskModel = {

  async findAllByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0] || null;
  },

  async create({ user_id, title, description }) {
    const [result] = await pool.query(
      'INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)',
      [user_id, title, description]
    );

    return { id: result.insertId, user_id, title, description };
  },

  async update(id, userId, { title, description }) {
    await pool.query(
      'UPDATE tasks SET title = ?, description = ? WHERE id = ? AND user_id = ?',
      [title, description, id, userId]
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
