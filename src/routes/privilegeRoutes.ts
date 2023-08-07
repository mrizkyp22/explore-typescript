import express from 'express';
import { getPrivileges } from '../controllers/privilegeController';

const router = express.Router();

router.get('/', getPrivileges);

export default router;
