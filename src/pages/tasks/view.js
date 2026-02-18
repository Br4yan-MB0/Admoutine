import { useEffect, useState } from 'react';
import TaskItem from '../../components/Tasks/TaskItem';

export default function TaskView() {
  const [tasks, setTasks] = useState([]); // inicializa como array

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTasks(data.tasks || []); // sempre garante array
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Minhas Tasks</h1>
      {tasks.length === 0 ? (
        <p>Nenhuma task encontrada.</p>
      ) : (
        tasks.map(task => <TaskItem key={task.id} task={task} />)
      )}
    </div>
  );
}
