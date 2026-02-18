import pool from '../lib/db';

export default class RoutineRunModel {

  static async start(userId, routineId) {

    const [result] = await pool.query(
      `INSERT INTO routine_runs 
       (routine_id, user_id, started_at, completed) 
       VALUES (?, ?, NOW(), 0)`,
      [routineId, userId]
    );

    return result.insertId;
  }

  static async finish(runId, userId) {
    await pool.query(
      `UPDATE routine_runs 
       SET finished_at = NOW(), completed = 1
       WHERE id = ? AND user_id = ?`,
      [runId, userId]
    );
  }

  static async getById(runId, userId) {
    const [rows] = await pool.query(
      `SELECT * FROM routine_runs
       WHERE id = ? AND user_id = ?`,
      [runId, userId]
    );

    return rows[0];
  }
  static async getActiveRun(userId, routineId) {
  const [rows] = await pool.query(
    `SELECT * FROM routine_runs
     WHERE user_id = ? 
     AND routine_id = ?
     AND completed = 0`,
    [userId, routineId]
  );

  return rows[0];
  }

}
