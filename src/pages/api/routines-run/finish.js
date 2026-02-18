import { verifyToken } from '../../../lib/auth';
import RoutineRunModel from '../../../models/RoutineRunModel';

export default async function handler(req, res) {
  try {
    if (req.method !== 'PUT') {
      return res.status(405).json({ message: 'Método não permitido' });
    }

    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({ message: 'Token inválido ou ausente' });
    }

    const { run_id } = req.body;

    if (!run_id) {
      return res.status(400).json({ message: 'ID da execução é obrigatório' });
    }

    await RoutineRunModel.finish(run_id, user.id);

    return res.status(200).json({
      message: 'Rotina finalizada com sucesso'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao finalizar rotina' });
  }
}
