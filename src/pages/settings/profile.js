import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Settings() {
  const [username, setUsername] = useState("Carregando...");
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
          setUsername(data.username || "Utilizador");
        }
      } catch (err) {
        console.error("Erro ao buscar dados do usuário");
      }
    };

    fetchUser();
    // Recupera o tema salvo
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
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleUpdate = async (type) => {
    const token = localStorage.getItem("token");
    const endpoint = "/api/settings/update-profile";
    
    const payload = type === 'username' ? { username } : { password: newPassword };

    if (type === 'password' && !newPassword) return alert("Por favor, digite a nova senha.");
    if (type === 'username' && !username) return alert("O nome de utilizador não pode estar vazio.");

    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(`${type === 'username' ? 'Nome de utilizador' : 'Senha'} atualizado com sucesso!`);
        if (type === 'password') setNewPassword("");
        
        if (type === 'username') {
          // Sincroniza o localStorage para o Dashboard atualizar o nome imediatamente
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          storedUser.username = username;
          localStorage.setItem("user", JSON.stringify(storedUser));
        }
      } else {
        const errorData = await res.json();
        alert("Erro ao atualizar: " + (errorData.message || "Verifique os dados."));
      }
    } catch (err) {
      alert("Falha na conexão com o servidor.");
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '60px auto',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <h1 style={{ color: '#c59d5f', fontSize: '1.6rem', textTransform: 'uppercase', letterSpacing: '3px', textAlign: 'center' }}>
        Configurações
      </h1>

      {/* SEÇÃO: PERFIL (SEM EMAIL, APENAS USERNAME E SENHA) */}
      <section style={{ background: '#1a1a1a', padding: '30px', borderRadius: '15px', border: '1px solid #332f2e' }}>
        <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: '#c59d5f' }}>👤</span> Perfil Profissional
        </h3>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Nome de Utilizador
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ flex: 1, padding: '12px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
            />
            <button onClick={() => handleUpdate('username')} style={{ background: '#c59d5f', color: '#000', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              OK
            </button>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ color: '#888', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>
            Alterar Senha
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="password" 
              placeholder="Nova senha secreta" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ flex: 1, padding: '12px', background: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
            />
            <button onClick={() => handleUpdate('password')} style={{ background: '#c59d5f', color: '#000', border: 'none', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              OK
            </button>
          </div>
        </div>
      </section>

      {/* SEÇÃO: APARÊNCIA (O BOTÃO DO TEMA) */}
      <section style={{ background: '#1a1a1a', padding: '25px', borderRadius: '15px', border: '1px solid #332f2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>🎨 Aparência</h3>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '5px' }}>Tema atual: {theme === 'dark' ? 'Escuro' : 'Claro'}</p>
        </div>
        <button onClick={toggleTheme} style={{ background: 'transparent', border: '1px solid #c59d5f', color: '#c59d5f', padding: '10px 20px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold' }}>
          {theme === "dark" ? "SOL ☀️" : "LUA 🌙"}
        </button>
      </section>

      {/* NAVEGAÇÃO E SAÍDA */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button 
          onClick={() => router.push('/dashboard/home')}
          style={{ background: 'rgba(255, 255, 255, 0.03)', color: '#888', border: '1px solid #332f2e', padding: '14px', borderRadius: '30px', cursor: 'pointer', fontWeight: '500' }}
          onMouseOver={(e) => e.target.style.color = '#fff'}
          onMouseOut={(e) => e.target.style.color = '#888'}
        >
          Voltar ao Painel
        </button>

        <button 
          onClick={handleLogout} 
          style={{ background: 'transparent', color: '#ff4d4d', border: 'none', fontSize: '0.85rem', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
        >
          SAIR DA CONTA
        </button>
      </div>
    </div>
  );
}