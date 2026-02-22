import { useState } from 'react';
import styles from '../../styles/NewEvent.module.css';

export default function NewEventModal({ onClose }) {
  const [category, setCategory] = useState('workout');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [tasksText, setTasksText] = useState('');

  const handleSave = async () => {
    if (!title) return alert("Por favor, dê um título ao evento.");
    
    const token = localStorage.getItem("token");
    
    // Processa as tarefas: garante que não enviamos lixo para a API
    const lines = tasksText.split(/\r?\n/).filter(line => line.trim() !== '');
    const processedTasks = lines.map(line => ({ task_name: line.trim() }));

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        // Adicionei is_completed e garanti que os campos batem com o esquema relacional
        body: JSON.stringify({ 
          title, 
          category, 
          tasks: processedTasks, 
          description: description || "Sem descrição", 
          recurrence: recurrence === 'none' ? null : recurrence,
          is_completed: false // Evita erro de campo nulo no banco
        })
      });

      if (res.ok) {
        onClose();
      } else {
        const errorData = await res.json();
        console.error("Erro da API:", errorData);
        alert(`Erro: ${errorData.message || "Falha ao salvar no banco"}`);
      }
    } catch (error) {
      console.error("Erro na comunicação:", error);
      alert("Erro de conexão. O servidor está ligado?");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} style={{ border: '1px solid #c59d5f' }}>
        <h2 className={styles.modalTitle}>Novo Evento</h2>
        
        <select value={category} onChange={e => setCategory(e.target.value)} className={styles.inputField}>
          <option value="workout">🏋️ Treino</option>
          <option value="social">📅 Social</option>
        </select>

        <div className={styles.fieldGroup}>
          <label className={styles.label} style={{ color: '#c59d5f', fontSize: '10px' }}>REPETIR:</label>
          <select value={recurrence} onChange={e => setRecurrence(e.target.value)} className={styles.inputField}>
            <option value="none">Não repetir</option>
            <option value="daily">Todo dia</option>
            <option value="weekly">Toda semana</option>
            <option value="monthly">Todo mês</option>
          </select>
        </div>

        <input 
          placeholder="Título do Evento" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          className={styles.inputField} 
        />

        <textarea 
          placeholder={category === 'workout' ? "Agachamento\nSupino\nRosca Direta" : "Descrição do compromisso..."}
          value={category === 'workout' ? tasksText : description}
          onChange={e => category === 'workout' ? setTasksText(e.target.value) : setDescription(e.target.value)}
          className={`${styles.inputField} ${styles.textarea}`}
          style={{ minHeight: '100px' }}
        />

        <div className={styles.buttonGroup} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={handleSave} 
            className={styles.btnSave}
            style={{ flex: 1, backgroundColor: '#c59d5f', color: '#000', border: 'none', borderRadius: '50px', padding: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Salvar
          </button>
          
          <button 
            type="button"
            onClick={onClose} 
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: 'transparent',
              color: '#888',
              border: '1px solid #332f2e',
              borderRadius: '50px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              fontSize: '11px',
              cursor: 'pointer',
              transition: '0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = '#c59d5f';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#888';
              e.currentTarget.style.borderColor = '#332f2e';
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}