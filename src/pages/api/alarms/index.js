import { verifyToken } from '../../../lib/auth';
import TaskModel from '../../../models/TaskModel';

export default async function handler(req, res) {
  const user = verifyToken(req);

  if (!user) {
    return res.status(401).json({ message: 'Token inválido ou ausente' });
  }

  if (req.method === 'GET') {
    const tasks = await TaskModel.findAllByUser(user.id);
    return res.status(200).json({ tasks });
  }

  if (req.method === 'POST') {
    const { title, description, duration } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Título é obrigatório' });
    }

    await TaskModel.create({
      user_id: user.id,
      title,
      description,
      duration
    });

    return res.status(201).json({ message: 'Task criada com sucesso' });
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
