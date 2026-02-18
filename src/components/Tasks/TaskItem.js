import { useState, useEffect, useRef } from "react";
import styles from "../../styles/T-Item.module.css";

export default function TaskItem({ task, onDelete, onComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(Number(task.duration) || 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60).toString().padStart(2, "0");
    const seconds = (sec % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
      if (onComplete) onComplete(task.id); 
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, secondsLeft, task.id, onComplete]);

  return (
    <div className={styles.taskCard}>
      <div className={styles.info}>
        <h3 className={styles.taskTitle}>{task.title}</h3>
        <p className={styles.timerDisplay}>{formatTime(secondsLeft)}</p>
      </div>

      <div className={styles.controls}>
        {!isRunning ? (
          <button onClick={() => setIsRunning(true)} className={styles.btnAction}>▶️ Iniciar</button>
        ) : (
          <button onClick={() => setIsRunning(false)} className={`${styles.btnAction} ${styles.btnPause}`}>⏸️ Pausar</button>
        )}
        <button onClick={() => { setIsRunning(false); setSecondsLeft(task.duration); }} className={styles.iconBtn}>🔄</button>
        <button onClick={() => onDelete(task.id)} className={`${styles.iconBtn} ${styles.btnDelete}`}>🗑️</button>
      </div>
    </div>
  );
}