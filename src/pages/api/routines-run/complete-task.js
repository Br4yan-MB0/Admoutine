import { verifyToken } from '../../../lib/auth';
import RoutineTaskRunModel from '../../../models/RoutineTaskRunModel';

export default async function handler(req, res) {
  // Use PATCH ou POST conforme sua preferência, mas mantenha a consistência
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  try {
    const { taskRunId, runId } = req.body;

    if (!taskRunId || !runId) {
      return res.status(400).json({ message: 'IDs de execução são obrigatórios' });
    }

    // CORREÇÃO: Passamos o user.id para o Model para garantir que o Alan 
    // só complete as tarefas da própria rotina dele.
    const affectedRows = await RoutineTaskRunModel.complete(taskRunId, runId, user.id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada ou não pertence ao usuário' });
    }

    return res.status(200).json({ message: 'Tarefa concluída com sucesso' });

  } catch (error) {
    console.error("Erro ao completar tarefa da rotina:", error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}