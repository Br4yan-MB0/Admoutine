import pool from '../lib/db';

export default class NotificationModel {
  static async create({ userId, message }) {
    await pool.query(
      'INSERT INTO notifications (user_id, message) VALUES (?, ?)',
      [userId, message]
    );
  }

  static async listByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  }
}
