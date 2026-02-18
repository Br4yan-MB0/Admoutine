import EventModel from '../../../models/EventsModel';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Token inválido ou ausente' });

  if (req.method === 'POST') {
    try {
      const { title, recurrence, category, description, tasks } = req.body;
      if (!title) return res.status(400).json({ message: 'O título é obrigatório' });

      const eventId = await EventModel.create({
        userId: user.id,
        title,
        recurrence: recurrence || 'none',
        category: category || 'workout',
        description,
        tasks: tasks || [] 
      });

      return res.status(201).json({ id: eventId, message: 'Criado com sucesso' });
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar evento' });
    }
  }

  if (req.method === 'GET') {
    try {
      const events = await EventModel.getAllByUser(user.id);
      return res.status(200).json(events);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar eventos' });
    }
  }

  return res.status(405).json({ message: 'Método não permitido' });
}