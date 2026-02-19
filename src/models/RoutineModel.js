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

  // 📌 Listar por usuário (Com JOIN para trazer as tarefas da rotina)
  static async getAllByUser(userId) {
    // 1. Busca as rotinas
    const [routines] = await pool.query(
      `SELECT id, name as title, description, is_active, created_at
       FROM routines
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    // 2. Busca as tarefas de cada rotina para montar o objeto completo
    const routinesWithTasks = await Promise.all(routines.map(async (routine) => {
      const [tasks] = await pool.query(
        `SELECT id, task_name, duration_seconds 
         FROM routine_tasks 
         WHERE routine_id = ? ORDER BY id ASC`,
        [routine.id]
      );
      return { ...routine, tasks };
    }));

    return routinesWithTasks;
  }

  // 📌 Buscar por ID (Também trazendo as tarefas)
  static async getById(id, userId) {
    const [rows] = await pool.query(
      `SELECT id, name as title, description, is_active, created_at
       FROM routines
       WHERE id = ? AND user_id = ?`,
      [id, userId]
    );

    if (rows.length === 0) return null;

    const [tasks] = await pool.query(
      `SELECT id, task_name, duration_seconds 
       FROM routine_tasks 
       WHERE routine_id = ? ORDER BY id ASC`,
      [id]
    );

    return { ...rows[0], tasks };
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

  // 📌 Deletar (Importante: as rotinas geralmente têm tarefas vinculadas)
  static async delete(id, userId) {
    // Primeiro deletamos as tarefas da rotina (ou use ON DELETE CASCADE no MySQL)
    await pool.query(`DELETE FROM routine_tasks WHERE routine_id = ?`, [id]);
    
    await pool.query(
      `DELETE FROM routines 
       WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
  }
}