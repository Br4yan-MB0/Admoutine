import pool from '../lib/db';

export default class UserSettingsModel {
  static async getByUserId(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM user_settings WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }

  static async createDefault(userId) {
    await pool.query(
      'INSERT INTO user_settings (user_id) VALUES (?)',
      [userId]
    );
  }

  static async update(userId, settings) {
    const { theme, notifications, timezone } = settings;

    await pool.query(
      `UPDATE user_settings 
       SET theme = ?, notifications = ?, timezone = ?
       WHERE user_id = ?`,
      [theme, notifications, timezone, userId]
    );
  }
}
