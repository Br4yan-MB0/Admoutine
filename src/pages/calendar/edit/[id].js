import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../../styles/NewEvent.module.css';

export default function EditEventPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('workout');
  const [recurrence, setRecurrence] = useState('none');
  const [tasksText, setTasksText] = useState('');

  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("token");
    fetch(`/api/events/edit/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setTitle(data.title);
        setDescription(data.description || '');
        setCategory(data.category);
        setRecurrence(data.recurrence);
        if (data.tasks) {
          setTasksText(data.tasks.map(t => t.task_name).join('\n'));
        }
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const processedTasks = tasksText.split('\n').filter(t => t.trim()).map(t => ({ task_name: t.trim() }));

    const res = await fetch(`/api/events/edit/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description, category, recurrence, tasks: processedTasks })
    });

    if (res.ok) router.push('/calendar/calendary');
    else alert("Erro ao atualizar.");
  };

  return (
    <div className={styles.overlay} style={{ position: 'relative', minHeight: '100vh' }}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Editar Evento</h2>
        <input className={styles.inputField} value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
        
        <select value={recurrence} onChange={e => setRecurrence(e.target.value)} className={styles.inputField}>
          <option value="none">Não repetir</option>
          <option value="daily">Diário</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensal</option>
        </select>

        <textarea 
          className={`${styles.inputField} ${styles.textarea}`}
          value={category === 'workout' ? tasksText : description}
          onChange={e => category === 'workout' ? setTasksText(e.target.value) : setDescription(e.target.value)}
          placeholder={category === 'workout' ? "Um exercício por linha" : "Descrição..."}
        />

        <div className={styles.buttonGroup}>
          <button onClick={handleUpdate} className={styles.btnSave}>Guardar Alterações</button>
          <button onClick={() => router.back()} className={styles.btnCancel}>Voltar</button>
        </div>
      </div>
    </div>
  );
}