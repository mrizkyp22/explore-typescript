import express from 'express';
import { registerUser, getUsers, getUserById } from '../controllers/userController';
import { accessToken } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.get('/', accessToken ,getUsers);
router.get('/:userId',accessToken, getUserById);

export default router;