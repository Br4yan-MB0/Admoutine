import db from "../../../lib/db"; 
import { verifyToken } from "../../../lib/auth"; 

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  // Tenta verificar o utilizador
  const decoded = verifyToken(req);

  // Se o decoded for null, ele manda o 401
  if (!decoded) {
    console.log("Erro: Token não verificado no update-profile");
    return res.status(401).json({ message: "Sessão inválida. Faça login novamente." });
  }

  const { username, password } = req.body;
  const userId = decoded.id; // Certifica-te que o teu token guarda o 'id'

  try {
    if (username) {
      await db.query("UPDATE users SET username = ? WHERE id = ?", [username, userId]);
    }

    if (password) {
      // Por agora, apenas para testar se grava (depois instalamos o bcrypt)
      await db.query("UPDATE users SET password = ? WHERE id = ?", [password, userId]);
    }

    return res.status(200).json({ message: "Sucesso!" });
  } catch (error) {
    console.error("Erro na base de dados:", error);
    return res.status(500).json({ message: "Erro ao gravar dados." });
  }
}