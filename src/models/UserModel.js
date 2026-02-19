import pool from '../lib/db';

export default class UserModel {
  static async create({ name, email, password, gender, nationality }) {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, gender, nationality) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, gender, nationality]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, gender, nationality FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }
}