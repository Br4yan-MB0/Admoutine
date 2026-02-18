import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import RoutineItem from "./RoutineItem";
import styles from '../../styles/Routine.module.css';

export default function RoutineList() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/routines", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRoutines(Array.isArray(data) ? data : data.routines || []);
      } catch (err) {
        console.error("Erro ao buscar rotinas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutines();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Deseja realmente excluir esta rotina?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/routines/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setRoutines((prev) => prev.filter((r) => r.id !== id));
    } catch (error) { console.error("Erro ao excluir:", error); }
  };

  // --- ESTILOS DE SEGURANÇA (Inline para não falhar) ---
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '1px solid #332f2e',
    paddingBottom: '15px'
  };

  const btnNovaStyle = {
    backgroundColor: '#c59d5f',
    color: '#1a1a1a',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '800',
    cursor: 'pointer',
    fontSize: '13px',
    textTransform: 'uppercase',
    transition: '0.2s'
  };

  const btnVoltarStyle = {
    backgroundColor: 'transparent',
    color: '#888',
    border: '1px solid #332f2e',
    padding: '14px',
    borderRadius: '8px',
    width: '100%',
    marginTop: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    textAlign: 'center',
    transition: '0.2s'
  };

  if (loading) return (
    <div className={styles.listContainer}>
      <p style={{color: '#c59d5f', textAlign: 'center', marginTop: '50px'}}>Carregando rotinas...</p>
    </div>
  );

  return (
    <div className={styles.listContainer}>
      <header style={headerStyle}>
        <h1 style={{ color: '#c59d5f', fontSize: '1.8rem', margin: 0 }}>Minhas Rotinas</h1>
        <button 
          style={btnNovaStyle} 
          onClick={() => router.push('/routine/new')}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d4af37'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#c59d5f'}
        >
          + NOVA
        </button>
      </header>

      {routines.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: '#1e1b1a', borderRadius: '12px', border: '1px solid #332f2e' }}>
          <p style={{ color: '#888' }}>Nenhuma rotina definida ainda.</p>
        </div>
      ) : (
        routines.map((item) => (
          <RoutineItem key={item.id} routine={item} onDelete={handleDelete} />
        ))
      )}

      <button 
        style={btnVoltarStyle} 
        onClick={() => router.push('/dashboard/home')}
        onMouseOver={(e) => {
          e.target.style.color = '#fff';
          e.target.style.borderColor = '#c59d5f';
          e.target.style.backgroundColor = '#2a2625';
        }}
        onMouseOut={(e) => {
          e.target.style.color = '#888';
          e.target.style.borderColor = '#332f2e';
          e.target.style.backgroundColor = 'transparent';
        }}
      >
        VOLTAR AO PAINEL
      </button>
    </div>
  );
}