// pages/tasks/edit.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TaskForm from '../../components/Tasks/TaskForm';

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = router.query;

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      const token = localStorage.getItem('token');

      const res = await fetch(`/api/tasks/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      // 🔍 encontra a task pelo ID
      const foundTask = data.tasks.find(t => t.id === Number(id));

      if (!foundTask) {
        router.push('/tasks/list');
        return;
      }

      setTask(foundTask);
      setLoading(false);
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return <p>Carregando task...</p>;
  }

  return (
    <TaskForm
      mode="edit"
      initialData={task}
    />
  );
}
