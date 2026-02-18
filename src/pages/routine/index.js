import { useState, useEffect } from "react";
import RoutineItem from "../../components/Routine/RoutineItem";
import styles from "../../styles/Routine.module.css";

export default function RoutinePage() {
  const [routines, setRoutines] = useState([]);

  const fetchRoutines = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/routines", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRoutines(data.routines || []);
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Minhas Rotinas</h1>
        <button className={styles.btnNew} onClick={() => window.location.href="/routine/new"}>+ Nova</button>
      </div>

      <div className={styles.grid}>
        {routines.length === 0 ? (
          <p className={styles.empty}>Nenhuma rotina cadastrada.</p>
        ) : (
          routines.map(r => (
            <RoutineItem 
              key={r.id} 
              routine={r} 
              onDelete={handleDelete} 
              onDeleteSuccess={(id) => setRoutines(prev => prev.filter(rt => rt.id !== id))} 
            />
          ))
        )}
      </div>
      
      <button className={styles.btnBack} onClick={() => window.location.href="/dashboard/home"}>
        Voltar ao Painel
      </button>
    </div>
  );
}