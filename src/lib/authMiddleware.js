import jwt from 'jsonwebtoken';

export function verifyToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    throw new Error('Token missing');

  const token = authHeader.split(' ')[1];
  return jwt.verify(token, process.env.JWT_SECRET);
}
