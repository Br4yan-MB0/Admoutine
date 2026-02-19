import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  // 1. Verifica se o header existe
  const authHeader = req?.headers?.authorization;
  if (!authHeader) {
    console.error("verifyToken: No Authorization header found");
    return null;
  }

  // 2. Extrai o token (remove a palavra 'Bearer')
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error("verifyToken: Token missing from Bearer format");
    return null;
  }

  try {
    // 3. Valida com o segredo do teu .env
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("verifyToken: JWT Verification failed", err.message);
    return null;
  }
}