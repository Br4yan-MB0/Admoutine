import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  // --- AJUSTES PARA VERCEL/AIVEN ---
  waitForConnections: true,    // Aguarda uma conexão ficar livre em vez de dar erro
  connectionLimit: 5,          // Mantém poucas conexões abertas (ideal para plano free)
  queueLimit: 0,               // Sem limite de fila para as requisições não "morrerem"
  // --------------------------------
  ssl: {
    rejectUnauthorized: false 
  }
});

export default pool;