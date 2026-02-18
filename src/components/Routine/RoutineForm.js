import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Routine.module.css';

export default function RoutineForm({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch('/api/routines', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ title, alarmTime }),
      });

      if (res.ok) {
        setTitle('');
        setAlarmTime('');
        if (onSuccess) {
          onSuccess(); // Se for um modal, isso vai fechar e atualizar a lista
        } else {
          // Se for uma página isolada, volta para o Dashboard principal
          router.push('/routine'); 
        }
      } else {
        alert("Erro ao salvar rotina.");
      }
    } catch (error) {
      console.error("Erro no formulário:", error);
    }
  };

  return (
  <div className={styles.formContainer}>
    <div className={styles.formCard}>
      <form onSubmit={handleSubmit}>
        <h2 className={styles.cardTitle}>Nova Atividade</h2>
        
        <div className={styles.fieldGroup}>
          <label className={styles.label}>O QUE VAMOS FAZER?</label>
          <input 
            className={styles.inputField}
            type="text" 
            placeholder="Ex: Treino de Perna..." 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>HORÁRIO DO ALARME</label>
          <input 
            className={styles.inputField}
            type="time" 
            value={alarmTime} 
            onChange={(e) => setAlarmTime(e.target.value)} 
            required
          />
        </div>

        <div className={styles.actions}>
          <button type="submit" className={styles.btnSave}>
            Confirmar Rotina
          </button>
          <button 
            type="button" 
            className={styles.btnCancel} 
            onClick={() => router.push('/dashboard/home')}
          >
            Voltar ao Dashboard
          </button>
        </div>
      </form>
    </div>
  </div>
);
}