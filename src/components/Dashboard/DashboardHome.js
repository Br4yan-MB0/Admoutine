import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router'; // 1. IMPORTAR O ROUTER
import styles from '../../styles/Home.module.css';

export default function DashboardHome() {
  // 1. Hooks de estado sempre no topo
  const { user, loading } = useAuth(); // ADICIONAR O LOADING AQUI
  const router = useRouter(); // INICIALIZAR O ROUTER
  const [stats, setStats] = useState({ productivity: 0, tasksDone: 0, tasksTotal: 0 });
  const [displayName, setDisplayName] = useState("Utilizador");

  // === PROTEÇÃO DE ROTA ===
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Se estiver carregando, mostra uma tela vazia ou um spinner para evitar o erro 307
  if (loading) return null; 

  // Se não tem user e não está carregando, não renderiza nada (o useEffect vai redirecionar)
  if (!user) return null;
  // ========================

  // 2. Efeito para carregar o nome de utilizador do localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setDisplayName(parsed.username || "Utilizador");
      } catch (e) {
        console.error("Erro ao ler user do localStorage", e);
      }
    } else if (user?.username) {
      setDisplayName(user.username);
    }
  }, [user]);

  // 3. Efeito para buscar as estatísticas
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await fetch('/api/user/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header} style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ color: '#c59d5f', fontSize: '1.8rem', fontWeight: '300' }}>
          Bem-vindo, <span style={{ color: '#c59d5f', fontWeight: 'bold' }}>{displayName}</span>
        </h2>
      </header>

      <section className={styles.statsGrid} style={{ display: 'flex', justifyContent: 'center' }}>
        <div className={styles.statCard} style={{ 
          background: '#1a1a1a', 
          padding: '30px', 
          borderRadius: '20px', 
          border: '1px solid #332f2e',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h3 style={{ color: '#c59d5f', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
            Produtividade do Dia
          </h3>
          <div className={styles.progressCircle} style={{ margin: '20px auto' }}>
            <span className={styles.percentage} style={{ fontSize: '2.5rem', color: '#fff', fontWeight: 'bold' }}>
              {stats.productivity}%
            </span>
          </div>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            {stats.tasksDone} de {stats.tasksTotal} tarefas concluídas
          </p>
        </div>
      </section>

      <footer className={styles.footer} style={{ marginTop: '60px', textAlign: 'center', borderTop: '1px solid #222', paddingTop: '30px' }}>
        <p className={styles.footerTitle} style={{ color: '#c59d5f', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
          PRECISA DE AJUDA COM SUA ROTINA?
        </p>
        <div className={styles.contactInfo} style={{ color: '#666', fontSize: '0.85rem', margin: '15px 0' }}>
          <span style={{ display: 'block', marginBottom: '5px' }}>📧 suporteadt@gmail.com</span>
          <span>💬 WhatsApp Premium</span>
        </div>
        <p className={styles.copyright} style={{ color: '#333', fontSize: '0.7rem' }}>
          © 2026 Chroutine - Ouro em cada segundo.
        </p>
      </footer>
    </div>
  );
}
