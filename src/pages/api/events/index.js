import EventModel from '../../../models/EventsModel';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  const user = verifyToken(req);
  if (!user) return res.status(401).json({ message: 'Sessão expirada' });

  if (req.method === 'POST') {
    try {
      const { title, recurrence, category, description, tasks } = req.body;
      if (!title) return res.status(400).json({ message: 'Título é obrigatório' });

      const eventId = await EventModel.create({
        userId: user.id,
        title,
        recurrence,
        category,
        description,
        tasks
      });

      return res.status(201).json({ id: eventId, message: 'Criado com sucesso' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao salvar evento' });
    }
  }

  if (req.method === 'GET') {
    try {
      const allEvents = await EventModel.getAllByUser(user.id);
      
      // FILTRO: Remove eventos sociais que já passaram da hora de expiração
      const now = new Date();
      const activeEvents = allEvents.filter(event => {
        if (event.category === 'social' && event.expires_at) {
          return new Date(event.expires_at) > now;
        }
        return true; // Workouts permanecem
      });

      return res.status(200).json(activeEvents);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar eventos' });
    }
  }

  return res.status(405).json({ message: 'Método não permitido' });
}