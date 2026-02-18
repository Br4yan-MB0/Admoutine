import pool from '../lib/db';

export default class AlarmModel {

  // Criar alarme
  static async create({ userId, alarmTime, type, referenceId }) {
    const [result] = await pool.query(
      `INSERT INTO alarms (user_id, alarm_time, type, reference_id, triggered)
       VALUES (?, ?, ?, ?, 0)`,
      [userId, alarmTime, type, referenceId]
    );

    return result.insertId;
  }

  // Listar alarmes pendentes
  static async listPending() {
    const [rows] = await pool.query(
      `SELECT *
       FROM alarms
       WHERE triggered = 0`
    );

    return rows;
  }

  // Marcar como disparado
  static async markTriggered(id) {
    await pool.query(
      `UPDATE alarms
       SET triggered = 1
       WHERE id = ?`,
      [id]
    );
  }

}
