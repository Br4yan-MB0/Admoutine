import { useEffect, useState } from 'react';
import styles from '../../styles/Home.module.css';

export default function DashboardHome() {
  const [user, setUser] = useState({ name: 'Usuário', nationality: '' });
  const [stats, setStats] = useState({ tasks: 85, events: 12, streak: 5 });
  const [quote, setQuote] = useState("");

  const quotes = [
    "A disciplina é a ponte entre metas e realizações.",
    "O seu futuro é criado pelo que você faz hoje, não amanhã.",
    "Mantenha o foco no seu ouro interior."
  ];

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (savedUser.name) setUser(savedUser);
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <h1 className={styles.welcome}>
          Olá, {user.name} <span className={styles.flag}>{user.nationality === 'Brasil' ? '🇧🇷' : '🏳️'}</span>
        </h1>
        <p className={styles.quote}>"{quote}"</p>
      </header>

      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Progresso Diário</span>
          <div className={styles.progressCircle}>
            <span className={styles.statValue}>{stats.tasks}%</span>
          </div>
          <p className={styles.statDesc}>Tasks concluídas hoje</p>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Eventos</span>
          <span className={styles.statValue}>{stats.events}</span>
          <p className={styles.statDesc}>Para esta semana</p>
        </div>

        <div className={styles.statCard}>
          <span className={styles.statLabel}>Fogo de Hábito</span>
          <span className={styles.statValue}>{stats.streak}🔥</span>
          <p className={styles.statDesc}>Dias seguidos</p>
        </div>
      </section>

      <div className={styles.marketingCard}>
        <h3>Sua Rotina, Seu Império</h3>
        <p>O Chroutine foi desenhado para quem não aceita o comum. Continue lapidando seu dia.</p>
      </div>

      <footer className={styles.footer}>
        <p className={styles.footerTitle}>PRECISA DE AJUDA COM SUA ROTINA?</p>
        <div className={styles.contactInfo}>
          <span>📧 suporte@chroutine.com</span>
          <span>💬 WhatsApp Premium</span>
        </div>
        <p className={styles.copyright}>© 2026 Chroutine - Ouro em cada segundo.</p>
      </footer>
    </div>
  );
}