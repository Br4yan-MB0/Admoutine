import { verifyToken } from '../../../lib/auth';
import RoutineModel from '../../../models/RoutineModel';

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({ message: 'Token inválido ou ausente' });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: 'ID da rotina é obrigatório' });
    }

    switch (req.method) {

      case 'GET':
        const routine = await RoutineModel.getById(id, user.id);

        if (!routine) {
          return res.status(404).json({ message: 'Rotina não encontrada' });
        }

        return res.status(200).json({ routine });

      case 'PUT':
        const { title, description } = req.body;

        if (!title) {
          return res.status(400).json({ message: 'Título é obrigatório' });
        }

        await RoutineModel.update(id, user.id, {
          title,
          description
        });

        return res.status(200).json({ message: 'Rotina atualizada com sucesso' });

      case 'DELETE':
        await RoutineModel.delete(id, user.id);
        return res.status(200).json({ message: 'Rotina removida com sucesso' });

      default:
        return res.status(405).json({ message: 'Método não permitido' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}
