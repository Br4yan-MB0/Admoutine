import { verifyToken } from '../../../lib/auth';
import NotificationModel from '../../../models/NotificationModel';

export default async function handler(req, res) {
  try {
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({ message: 'Token inválido ou ausente' });
    }

    switch (req.method) {
      case 'GET':
        const notifications = await NotificationModel.listByUser(user.id);
        return res.status(200).json({ notifications });

      case 'POST':
        const { message } = req.body;
        if (!message) return res.status(400).json({ message: 'Mensagem é obrigatória' });

        await NotificationModel.create({ userId: user.id, message });
        return res.status(201).json({ message: 'Notificação criada' });

      default:
        return res.status(405).json({ message: 'Método não permitido' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}
