import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key';

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, JWT_SECRET);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
