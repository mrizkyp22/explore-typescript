import * as dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import { generateToken, verifyToken } from '../middlewares/jwt'; // Import JWT functions
import Auth, { IAuth } from '../models/authModel';
import {
  handleServerError,
  handleBadRequest,
  handleNoAccess,
  handleUnauthorized
} from '../utils/errorHandler';

export const getLogin = async (req: Request, res: Response) => {
  try {
    const { username, password, ...extraFields } = req.body;

    if (Object.keys(extraFields).length > 0) {
      return handleBadRequest(res, 'Additional fields are not allowed');
    }

    const auth: IAuth | null = await Auth.findOne({ username, password });

    if (auth) {
      const salt = process.env.SALT
      const iv = process.env.IV
      const tokenPayload = { 
        username: auth.username, 
        roleId: auth.roleId, 
        salt,
        iv
      };
      const token = generateToken(tokenPayload);
      const data = {
        username: auth.username,
        roleId: auth.roleId,
        accessToken: token
      }

            // Store the generated token in the database
            auth.accessToken = token;
            await auth.save();

      res.json({ message: 'Login successful', data });
    } else {
      handleUnauthorized(res, 'Login failed')
    }
  } catch (error) {
    handleServerError(res, error);
  }
}

export const accessToken = async (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;
  
    if (typeof authHeader !== 'undefined') {
      const token = authHeader.split(' ')[1];
  
      try {
        const decoded = verifyToken(token);
        console.log(decoded)
        next();
      } catch (error) {
        handleNoAccess(res,'Invalid token')
      }
    } else {
      handleUnauthorized(res, 'Unauthorized')
    }
  };
  