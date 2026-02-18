import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../../styles/Routine.module.css";

export default function EditRoutine() {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchRoutine = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`/api/routines/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          // Aqui garantimos que o título e a hora sejam carregados nos campos
          setTitle(data.routine.title);
          setTime(data.routine.time ? data.routine.time.substring(0, 5) : "");
        }
      } catch (err) {
        console.error("Erro ao carregar rotina:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutine();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/routines/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({ title, alarmTime: time }),
    });

    if (res.ok) {
      router.push('/routines');
    } else {
      alert("Erro ao salvar alterações.");
    }
  };

  if (loading) return <div className={styles.container}>Carregando dados...</div>;

  return (
    <div className={styles.container}>
      <form onSubmit={handleUpdate} className={styles.formCard}>
        <h2 className={styles.cardTitle}>Editar Rotina</h2>
        
        <div className={styles.inputGroup}>
          <label className={styles.label}>Nome da Atividade</label>
          <input 
            className={styles.inputField}
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Horário</label>
          <input 
            className={styles.inputField}
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            required
          />
        </div>

        <button type="submit" className={styles.btnPrimary}>Salvar Alterações</button>
        <button 
          type="button" 
          className={styles.btnOutline} 
          onClick={() => router.back()}
          style={{ marginTop: '10px', cursor: 'pointer' }}
        >
          Voltar
        </button>
      </form>
    </div>
  );
}