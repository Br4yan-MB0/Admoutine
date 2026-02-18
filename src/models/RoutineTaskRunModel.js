import pool from '../lib/db';

export default class RoutineTaskRunModel {

  // marcar tarefa da execução como concluída
  static async complete(taskRunId, runId) {

    await pool.query(
      `UPDATE routine_task_runs
       SET completed = 1, finished_at = NOW()
       WHERE id = ?`,
      [taskRunId]
    );

    // verificar se ainda existem tarefas pendentes
    const [rows] = await pool.query(
      `SELECT COUNT(*) as pending
       FROM routine_task_runs
       WHERE routine_run_id = ?
       AND completed = 0`,
      [runId]
    );

    if (rows[0].pending === 0) {
      await pool.query(
        `UPDATE routine_runs
         SET completed = 1, finished_at = NOW()
         WHERE id = ?`,
        [runId]
      );
    }
  }
}
