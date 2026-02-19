import pool from '../lib/db';

export default class RoutineRunModel {
  // Iniciar uma nova execução de rotina
  static async start(userId, routineId) {
    const [result] = await pool.query(
      `INSERT INTO routine_runs (user_id, routine_id, created_at, completed) 
       VALUES (?, ?, NOW(), 0)`,
      [userId, routineId]
    );
    return result.insertId;
  }

  // Buscar execução ativa
  static async getActiveRun(userId, routineId) {
    const [rows] = await pool.query(
      `SELECT id FROM routine_runs 
       WHERE user_id = ? AND routine_id = ? AND completed = 0 
       LIMIT 1`,
      [userId, routineId]
    );
    return rows[0];
  }
}