import { useState } from 'react';
import styles from '../../styles/NewEvent.module.css';

export default function NewEventModal({ onClose }) {
  const [category, setCategory] = useState('workout');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [tasksText, setTasksText] = useState('');

  const handleSave = async () => {
    if (!title) return alert("Digite um título");
    
    // Pega o token do localStorage
    const token = localStorage.getItem("token");
    
    const lines = tasksText.split(/\r?\n/).filter(line => line.trim() !== '');
    const processedTasks = lines.map(line => ({ task_name: line.trim() }));

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ADICIONADO ISSO PARA RESOLVER O 401
        },
        body: JSON.stringify({ 
          title, 
          category, 
          tasks: processedTasks, 
          description, 
          recurrence 
        })
      });

      if (res.ok) {
        onClose();
      } else if (res.status === 401) {
        alert("Sua sessão expirou. Faça login novamente.");
      } else {
        alert("Erro ao salvar no banco de dados.");
      }
    } catch (error) {
      console.error("Erro na comunicação:", error);
      alert("Erro de rede ao tentar salvar.");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Novo Evento</h2>
        
        <select value={category} onChange={e => setCategory(e.target.value)} className={styles.inputField}>
          <option value="workout">🏋️ Treino</option>
          <option value="social">📅 Social</option>
        </select>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>REPETIR:</label>
          <select value={recurrence} onChange={e => setRecurrence(e.target.value)} className={styles.inputField}>
            <option value="none">Selecionar...</option>
            <option value="daily">Todo dia</option>
            <option value="weekly">Toda semana</option>
            <option value="monthly">Todo mês</option>
          </select>
        </div>

        <input 
          placeholder="Título" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          className={styles.inputField} 
        />

        <textarea 
          placeholder={category === 'workout' ? "Cole os exercícios (um por linha)" : "Descrição..."}
          value={category === 'workout' ? tasksText : description}
          onChange={e => category === 'workout' ? setTasksText(e.target.value) : setDescription(e.target.value)}
          className={`${styles.inputField} ${styles.textarea}`}
        />

        <div className={styles.buttonGroup}>
          <button onClick={handleSave} className={styles.btnSave}>Salvar</button>
          <button onClick={onClose} className={styles.btnCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}