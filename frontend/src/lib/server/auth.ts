import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

const SECRET_KEY = JWT_SECRET || "";

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded; // Return the decoded token payload
  } catch (error) {
    return null; // Token is invalid
  }
}
