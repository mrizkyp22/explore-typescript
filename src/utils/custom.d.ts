import { Request } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      auth?: jwt.JwtPayload;
    }
  }
}