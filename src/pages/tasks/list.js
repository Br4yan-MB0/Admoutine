import { useState, useEffect } from "react";
import TaskItem from "../../components/Tasks/TaskItem";
import styles from "../../styles/Tasks.module.css";

export default function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleTaskComplete = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status: 'completed' }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar tarefa");

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
        alert("Parabéns! Foco concluído.");
      }
    } catch (err) {
      alert("Erro ao salvar progresso: " + err.message);
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
    <div style={{
      maxWidth: '600px',
      margin: '60px auto',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '80vh'
    }}>
      {/* TÍTULO REFINADO */}
      <h1 style={{ 
        color: '#c59d5f', 
        fontSize: '1.4rem', 
        textTransform: 'uppercase', 
        letterSpacing: '2px',
        marginBottom: '40px',
        borderBottom: '1px solid #332f2e',
        paddingBottom: '15px',
        width: '100%',
        textAlign: 'center'
      }}>
        Foco do Dia
      </h1>

      {/* GRID DE TAREFAS - LEMBRETES MENORES */}
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        fontSize: '0.9rem' // Diminui o texto para parecer lembrete
      }}>
        {loading ? (
          <p style={{ color: '#666', textAlign: 'center' }}>Carregando foco...</p>
        ) : tasks.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', fontStyle: 'italic', marginTop: '20px' }}>
            Nada pendente. Aproveite o seu tempo!
          </p>
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

      {/* BOTÃO VOLTAR - ESTILO PILL GLASS */}
      <button 
        onClick={() => window.location.href="/dashboard/home"}
        style={{
          marginTop: '60px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          color: '#888',
          border: '1px solid #332f2e',
          padding: '12px 40px',
          borderRadius: '30px',
          fontSize: '0.85rem',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          letterSpacing: '1px'
        }}
        onMouseOver={(e) => {
          e.target.style.color = '#c59d5f';
          e.target.style.borderColor = '#c59d5f';
          e.target.style.backgroundColor = 'transparent';
        }}
        onMouseOut={(e) => {
          e.target.style.color = '#888';
          e.target.style.borderColor = '#332f2e';
          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
        }}
      >
        ← VOLTAR AO PAINEL
      </button>
    </div>
  );
}