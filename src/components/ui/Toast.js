import { useEffect } from 'react';
import styles from '../../styles/Toast.module.css';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {message}
    </div>
  );
}