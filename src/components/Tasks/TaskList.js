import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import TaskItem from "./TaskItem"; 
import styles from '../../styles/Routine.module.css';

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/tasks", { 
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

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#c59d5f' }}>
      <p>Carregando ouro...</p>
    </div>
  );

  return (
    <div style={{ 
      maxWidth: '600px', // Mais estreito para centralizar e dar foco
      margin: '60px auto', 
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center' // Centraliza os itens no eixo X
    }}>
      
      {/* HEADER CENTRALIZADO */}
      <header style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        borderBottom: '1px solid #332f2e',
        paddingBottom: '20px'
      }}>
        <h1 style={{ color: '#c59d5f', fontSize: '1.5rem', margin: 0, letterSpacing: '1px', textTransform: 'uppercase' }}>
          Tarefas
        </h1>
        <button 
          onClick={() => router.push('/tasks/new')}
          style={{
            backgroundColor: '#c59d5f',
            color: '#111',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '20px', // Botão mais arredondado e moderno
            fontWeight: 'bold',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: '0.3s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          + NOVA
        </button>
      </header>

      {/* LISTA DE TAREFAS (Lembretes menores) */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontStyle: 'italic' }}>
            Nenhuma pendência para hoje.
          </div>
        ) : (
          tasks.map((item) => (
            // Encapsulando o TaskItem para forçar um estilo mais minimalista
            <div key={item.id} style={{ fontSize: '0.9rem' }}> 
              <TaskItem task={item} onDelete={handleDelete} />
            </div>
          ))
        )}
      </div>

      {/* BOTÃO DE VOLTAR - ESTILO "GLASS" MINIMALISTA */}
      <footer style={{ width: '100%', marginTop: '50px', textAlign: 'center' }}>
        <button 
          onClick={() => router.push('/dashboard/home')}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            color: '#888',
            border: '1px solid #332f2e',
            padding: '12px 30px',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '0.5px'
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
          ← Voltar ao Painel
        </button>
      </footer>
    </div>
  );
}