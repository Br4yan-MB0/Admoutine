import pool from '../lib/db';

export default class RoutineModel {

  // 📌 Criar rotina
  static async create({ userId, name, description }) {

    if (!userId || !name) {
      throw new Error('Dados inválidos para criar rotina');
    }

    const [result] = await pool.query(
      `INSERT INTO routines 
       (user_id, name, description, is_active, created_at) 
       VALUES (?, ?, ?, 1, NOW())`,
      [userId, name, description || null]
    );

    return result.insertId;
  }

  // 📌 Listar por usuário
  static async getAllByUser(userId) {
    const [rows] = await pool.query(
      `SELECT id, name as title, description, is_active, created_at
       FROM routines
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    return rows;
  }

  // 📌 Buscar por ID
  static async getById(id, userId) {
    const [rows] = await pool.query(
      `SELECT id, name as title, description, is_active, created_at
       FROM routines
       WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    return rows[0];
  }

  // 📌 Atualizar
  static async update(id, userId, { title, description }) {
    await pool.query(
      `UPDATE routines 
       SET name = ?, description = ?
       WHERE id = ? AND user_id = ?`,
      [title, description || null, id, userId]
    );
  }

  // 📌 Deletar
  static async delete(id, userId) {
    await pool.query(
      `DELETE FROM routines 
       WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
  }
}
