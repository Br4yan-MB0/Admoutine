import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../styles/Settings.module.css"; // Importando o CSS

export default function Settings() {
  const [email, setEmail] = useState("Carregando...");
  const [newPassword, setNewPassword] = useState("");
  const [theme, setTheme] = useState("dark");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setEmail(data.email);
        }
      } catch (err) {
        console.error("Erro ao buscar dados do usuário");
      }
    };

    fetchUser();
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) return alert("Por favor, digite a nova senha.");
    const token = localStorage.getItem("token");
    const res = await fetch("/api/auth/update-password", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ password: newPassword }),
    });

    if (res.ok) {
      alert("Senha atualizada com sucesso!");
      setNewPassword("");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Configurações</h1>

      <section className={styles.card}>
        <h3 className={styles.cardTitle}>👤 Perfil</h3>
        <div className={styles.infoGroup}>
          <p className={styles.label}>E-mail da conta:</p>
          <p className={styles.value}>{email}</p>
        </div>
        
        <div className={styles.infoGroup}>
          <label className={styles.label}>Alterar Senha:</label>
          <input 
            type="password" 
            placeholder="Nova senha secreta" 
            className={styles.inputField}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleUpdatePassword} className={styles.btnPrimary}>
            SALVAR NOVA SENHA
          </button>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.appearanceRow}>
          <div>
            <h3 className={styles.cardTitle}>🎨 Aparência</h3>
            <p className={styles.label}>Tema atual: {theme === 'dark' ? 'Escuro' : 'Claro'}</p>
          </div>
          <button onClick={toggleTheme} className={styles.btnOutline}>
            {theme === "dark" ? "SOL ☀️" : "LUA 🌙"}
          </button>
        </div>
      </section>

      <button onClick={handleLogout} className={styles.btnLogout}>
        SAIR DA CONTA
      </button>
      <button onClick={() => window.location.href="/dashboard/home"}>Voltar</button>
    </div>
  );
}