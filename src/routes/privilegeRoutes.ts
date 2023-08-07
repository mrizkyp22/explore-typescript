import express from 'express';
import { getPrivileges, getPrivilegeDetail } from '../controllers/privilegeController';

const router = express.Router();

router.get('/', getPrivileges);
router.get('/:roleId', getPrivilegeDetail);

export default router;
