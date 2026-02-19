import pool from '../lib/db';

export default class RoutineTaskRunModel {

  static async complete(taskRunId, runId, userId) {
    // 1. Marca como concluída usando 'completed = 1'
    const [result] = await pool.query(
      `UPDATE routine_task_runs rtr
       JOIN routine_runs rr ON rtr.routine_run_id = rr.id
       SET rtr.completed = 1, rtr.finished_at = NOW() 
       WHERE rtr.id = ? AND rr.id = ? AND rr.user_id = ?`,
      [taskRunId, runId, userId]
    );

    // 2. Verifica pendentes usando 'completed = 0'
    const [rows] = await pool.query(
      `SELECT COUNT(*) as pending
       FROM routine_task_runs
       WHERE routine_run_id = ? AND completed = 0`,
      [runId]
    );

    // 3. Finaliza a execução da rotina pai
    if (rows[0].pending === 0) {
      await pool.query(
        `UPDATE routine_runs
         SET completed = 1, finished_at = NOW()
         WHERE id = ?`,
        [runId]
      );
    }

    return result.affectedRows;
  }
}