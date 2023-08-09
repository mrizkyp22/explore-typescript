import express from 'express';
import { registerUser, getUsers, getUserById } from '../controllers/userController';
import { accessToken } from '../controllers/authController';
import { checkPrivilege } from '../middlewares/checkPrivileges';

const router = express.Router();

router.post('/register',checkPrivilege('create_new_user'), registerUser);
router.get('/', accessToken, checkPrivilege('read_list_user'), getUsers);
router.get('/:userId',accessToken, checkPrivilege('read_detail_user'), getUserById);

export default router;