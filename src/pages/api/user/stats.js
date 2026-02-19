import pool from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Não autorizado' });

  try {
    // 1. Tasks Simples: Filtra por hoje
    const [taskRows] = await pool.query(
      `SELECT COUNT(*) as total, 
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as done 
       FROM tasks WHERE user_id = ? AND DATE(created_at) = CURDATE()`,
      [user.id]
    );

    // 2. Event Tasks: Removemos o join complexo se a coluna for diferente
    // Aqui usamos IFNULL(SUM(...), 0) para evitar que o total venha como NULL
    const [eventRows] = await pool.query(
      `SELECT COUNT(*) as total, 
       SUM(CASE WHEN et.is_completed = 1 THEN 1 ELSE 0 END) as done 
       FROM event_tasks et
       JOIN events e ON et.event_id = e.id
       WHERE e.user_id = ? AND DATE(e.created_at) = CURDATE()`,
      [user.id]
    );

    // 3. Routine Tasks: Ajustado para usar 'completed' em vez de 'status'
    const [routineRows] = await pool.query(
      `SELECT COUNT(*) as total, 
       SUM(CASE WHEN rtr.completed = 1 THEN 1 ELSE 0 END) as done 
       FROM routine_task_runs rtr
       JOIN routine_runs rr ON rtr.routine_run_id = rr.id
       WHERE rr.user_id = ? AND DATE(rr.created_at) = CURDATE()`,
      [user.id]
    );

    // Calculando totais com segurança (garantindo que são números)
    const totalTasks = Number(taskRows[0].total || 0);
    const doneTasks = Number(taskRows[0].done || 0);

    const totalEvents = Number(eventRows[0].total || 0);
    const doneEvents = Number(eventRows[0].done || 0);

    const totalRoutines = Number(routineRows[0].total || 0);
    const doneRoutines = Number(routineRows[0].done || 0);

    const finalTotal = totalTasks + totalEvents + totalRoutines;
    const finalDone = doneTasks + doneEvents + doneRoutines;

    const productivity = finalTotal > 0 ? Math.round((finalDone / finalTotal) * 100) : 0;

    return res.status(200).json({
      productivity,
      tasksDone: finalDone,
      tasksTotal: finalTotal
    });
  } catch (error) {
    console.error("ERRO NO STATS:", error); // Isso vai te mostrar o erro real no terminal
    return res.status(500).json({ error: error.message });
  }
}