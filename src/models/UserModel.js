import pool from '../lib/db';

export default class UserModel {
  // Ajustado: removido 'name' e corrigido 'email' para 'username'
  static async create({ username, password, gender, nationality }) {
    const [result] = await pool.query(
      'INSERT INTO users (username, password, gender, nationality) VALUES (?, ?, ?, ?)',
      [username, password, gender, nationality]
    );
    return result.insertId;
  }

  // Ajustado: agora recebe 'username' e usa a variável correta na query
  static async findByEmail(username) { 
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username] // Antes aqui estava dando erro porque 'username' não existia
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, username, gender, nationality FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }
}