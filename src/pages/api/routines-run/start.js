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

    const { routineId } = req.body;

    if (!routineId) {
      return res.status(400).json({ message: 'ID da rotina é obrigatório' });
    }

    // CORREÇÃO: Movi a declaração para cima da verificação
    const existingRun = await RoutineRunModel.getActiveRun(user.id, routineId);

    if (existingRun) {
      return res.status(400).json({ 
        message: 'Já existe uma execução ativa dessa rotina',
        runId: existingRun.id
      });
    }

    // 1️⃣ Criar a execução (Run)
    const runId = await RoutineRunModel.start(user.id, routineId);

    // 2️⃣ Copiar as tarefas da rotina para a tabela de execução do dia
    // Isso é o que permite marcar como "concluído" sem alterar a rotina original
    await RoutineTaskRunModel.copyFromRoutine(runId, routineId);

    return res.status(201).json({ runId });

  } catch (error) {
    console.error("Erro no Start Routine:", error);
    return res.status(500).json({ message: 'Erro interno ao iniciar rotina' });
  }
}