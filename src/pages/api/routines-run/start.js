import { verifyToken } from '../../../lib/auth';
import RoutineRunModel from '../../../models/RoutineRunModel';
import RoutineTaskRunModel from '../../../models/RoutineTaskRunModel';

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {

    const user = verifyToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Não autorizado' });
    }
    // verificar se já existe ativa
    const existingRun = await RoutineRunModel.getActiveRun(user.id, routineId);

    if (existingRun) {
    return res.status(400).json({ 
        message: 'Já existe uma execução ativa dessa rotina',
        runId: existingRun.id
    });
    }


    const { routineId } = req.body;

    // 1️⃣ criar run
    const runId = await RoutineRunModel.start(user.id, routineId);

    // 2️⃣ copiar tasks
    await RoutineTaskRunModel.copyFromRoutine(runId, routineId);

    return res.status(201).json({ runId });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno' });
  }
}
