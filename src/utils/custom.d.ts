// import { Request } from 'express';
import jwt from 'jsonwebtoken';

// declare global {
//   namespace Express {
//     interface Request {
//       auth?: jwt.JwtPayload;
//       user?: any;
//     }
//   }
// }

import 'express';

declare module 'express' {
  interface Request {
    user?: any;
    auth?: jwt.JwtPayload;
  }
}