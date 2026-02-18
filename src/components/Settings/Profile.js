export default function Profile({ email }) {
  // Dentro do componente Settings
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // Remove classes antigas e aplica a nova
    document.body.classList.remove("dark", "light");
    document.body.classList.add(newTheme);
  };
  return (
    <div className="item-card">
       <p>User: {email || "Carregando..."}</p>
    </div>
    
  );
}