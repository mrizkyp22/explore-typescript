import express from 'express';
import { registerUser, getUsers, getUserById } from '../controllers/userController';

const router = express.Router();

router.post('/register', registerUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);

export default router;