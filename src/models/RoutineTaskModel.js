import pool from '../lib/db';

export default class RoutineTaskRunModel {

  // copiar tasks da rotina para o run
  static async copyFromRoutine(runId, routineId) {

    await pool.query(
      `INSERT INTO routine_task_runs 
       (routine_run_id, routine_task_id, completed)
       SELECT ?, id, 0
       FROM routine_tasks
       WHERE routine_id = ?`,
      [runId, routineId]
    );
  }

  static async complete(taskRunId) {
    await pool.query(
      `UPDATE routine_task_runs
       SET completed = 1, finished_at = NOW()
       WHERE id = ?`,
      [taskRunId]
    );
  }

  static async getByRun(runId) {
    const [rows] = await pool.query(
      `SELECT rtr.*, rt.title, rt.description, rt.duration
       FROM routine_task_runs rtr
       JOIN routine_tasks rt ON rt.id = rtr.routine_task_id
       WHERE rtr.routine_run_id = ?
       ORDER BY rt.task_order ASC`,
      [runId]
    );

    return rows;
  }
}
