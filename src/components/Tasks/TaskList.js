import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import TaskItem from "./TaskItem"; // Renomeado de RoutineItem para TaskItem conforme sua estrutura
import styles from '../../styles/Routine.module.css';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tasks", { // Endpoint de tasks
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error("Erro ao buscar:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Deseja excluir esta tarefa?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className={styles.listContainer}><p>Carregando tarefas...</p></div>;

  return (
    <div className={styles.listContainer}>
      <header className={styles.listHeader}>
        <h1 className={styles.cardTitle}>Minhas Tarefas</h1>
        <button 
          className={styles.addBtnSmall} 
          onClick={() => router.push('/tasks/new')}
        >
          + Nova
        </button>
      </header>

      {tasks.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhuma tarefa pendente.</p>
        </div>
      ) : (
        tasks.map((item) => (
          <TaskItem key={item.id} task={item} onDelete={handleDelete} />
        ))
      )}

      <div className={styles.actions}>
        <button 
          className={styles.btnCancel} 
          onClick={() => router.push('/dashboard/home')}
        >
          Voltar ao Painel
        </button>
      </div>
    </div>
  );
}