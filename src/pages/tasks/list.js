import { useState, useEffect } from "react";
import TaskItem from "../../components/Tasks/TaskItem";
import styles from "../../styles/Tasks.module.css";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(data.tasks || []);
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleTaskComplete = (taskId) => {
    const currentIndex = tasks.findIndex(t => t.id === taskId);
    const completedTask = tasks[currentIndex];
    const nextTask = tasks[currentIndex + 1];

    setTasks(prev => prev.filter(t => t.id !== taskId));

    if (nextTask) {
      if (confirm(`"${completedTask.title}" concluída! Iniciar próxima: "${nextTask.title}"?`)) {
        setTimeout(() => {
          const nextPlayBtn = document.querySelector(`#btn-play-${nextTask.id}`);
          if (nextPlayBtn) nextPlayBtn.click();
        }, 500);
      }
    } else {
      alert("Parabéns! Lista concluída.");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm("Excluir esta tarefa?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchTasks();
  };

  return (
    <div className={styles.listWrapper}>
      <h1 className={styles.pageTitle}>Foco do Dia</h1>
      <div className={styles.tasksGrid}>
        {tasks.length === 0 ? (
          <p className={styles.noTasks}>Nada pendente. Aproveite!</p>
        ) : (
          tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onDelete={handleDeleteTask}
              onComplete={handleTaskComplete}
            />
          ))
        )}
      </div>
      <button className={styles.backBtn} onClick={() => window.location.href="/dashboard/home"}>
        Voltar
      </button>
    </div>
  );
}