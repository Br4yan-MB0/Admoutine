import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import RoutineItem from "./RoutineItem";
import AlarmChecker from "./AlarmChecker";
import styles from '../../styles/Routine.module.css';

export default function RoutineList() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchRoutines = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/routines", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRoutines(data.routines || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoutines(); }, []);

  if (loading) return <p style={{textAlign: 'center', color: '#c59d5f'}}>Carregando...</p>;

  return (
    <div className={styles.listContainer}>
      {/* Ativa o sistema de alarmes */}
      <AlarmChecker routines={routines} />

      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 style={{ color: '#c59d5f' }}>Rotinas</h1>
        <button onClick={() => router.push('/routine/new')} style={{ backgroundColor: '#c59d5f', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
          + NOVA
        </button>
      </header>

      {routines.map((r) => (
        <RoutineItem key={r.id} routine={r} onDelete={fetchRoutines} />
      ))}
    </div>
  );
}