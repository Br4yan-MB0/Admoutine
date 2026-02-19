import { useState, useEffect } from "react";
import RoutineItem from "../../components/Routine/RoutineItem";
import styles from "../../styles/Routine.module.css";

export default function RoutinePage() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutines = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/routines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRoutines(data.routines || []);
    } catch (err) {
      console.error("Erro ao buscar rotinas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoutines(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Excluir rotina?")) return;
    const token = localStorage.getItem("token");
    await fetch(`/api/routines/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setRoutines(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div style={{
      maxWidth: '700px', // Um pouco mais largo que o de tarefas para o grid
      margin: '60px auto',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '80vh'
    }}>
      
      {/* HEADER ALINHADO E CHIQUE */}
      <div style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px',
        borderBottom: '1px solid #332f2e',
        paddingBottom: '20px'
      }}>
        <h1 style={{ color: '#c59d5f', fontSize: '1.4rem', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>
          Minhas Rotinas
        </h1>
        <button 
          onClick={() => window.location.href="/routine/new"}
          style={{
            backgroundColor: '#c59d5f',
            color: '#111',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '20px',
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
      </div>

      {/* GRID DE ROTINAS ORGANIZADO */}
      <div style={{ 
        width: '100%', 
        display: 'grid', 
        gridTemplateColumns: '1fr', // Uma coluna para parecer lembrete/lista limpa
        gap: '15px' 
      }}>
        {loading ? (
          <p style={{ color: '#c59d5f', textAlign: 'center' }}>Carregando rotinas...</p>
        ) : routines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#1a1a1a', borderRadius: '12px', border: '1px dashed #333' }}>
            <p style={{ color: '#666', margin: 0 }}>Nenhuma rotina cadastrada.</p>
          </div>
        ) : (
          routines.map(r => (
            <div key={r.id} style={{ fontSize: '0.9rem' }}>
              <RoutineItem 
                routine={r} 
                onDelete={handleDelete} 
                onDeleteSuccess={(id) => setRoutines(prev => prev.filter(rt => rt.id !== id))} 
              />
            </div>
          ))
        )}
      </div>
      
      {/* BOTÃO VOLTAR PILL STYLE */}
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