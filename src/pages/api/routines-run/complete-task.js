import { verifyToken } from '../../../lib/auth';
import RoutineTaskRunModel from '../../../models/RoutineTaskRunModel';

export default async function handler(req, res) {

  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { taskRunId, runId } = req.body;

    await RoutineTaskRunModel.complete(taskRunId, runId);

    return res.status(200).json({ message: 'Tarefa concluída' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno' });
  }
}
