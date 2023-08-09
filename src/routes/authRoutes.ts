// src/routes/auth.ts
import express, { Request, Response } from 'express';
import AuthModel from '../models/authModel';
import { getLogin, accessToken } from '../controllers/authController';

const router = express.Router();

router.get('/protected-route',accessToken)

router.post('/login', getLogin)

export default router;
