import jwt from 'jsonwebtoken';
import 'express';

declare module 'express' {
  interface Request {
    user?: any;
    auth?: jwt.JwtPayload;
  }
}