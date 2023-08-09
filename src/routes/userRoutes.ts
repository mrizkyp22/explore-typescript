import express from 'express';
import {
  registerUser,
  getUsers,
  getUserById
} from '../controllers/userController';
import { accessToken } from '../controllers/authController';
import { checkPrivilege } from '../middlewares/checkPrivileges';

const router = express.Router();

// Apply access token middleware to protect all routes
router.use(accessToken);

// Define routes with chained middlewares
router.post('/register', checkPrivilege('create_new_user'), registerUser);
router.get('/', checkPrivilege('read_list_user'), getUsers);
router.get('/:userId', checkPrivilege('read_detail_user'), getUserById);

export default router;