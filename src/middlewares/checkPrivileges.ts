import { Request, Response, NextFunction } from 'express';
import Privileges from '../models/privilegeModel';
import { verifyToken } from './jwt';
import { handleNoAccess, handleUnauthorized } from '../utils/errorHandler';

export function checkPrivilege(attributeId: string) {

    return async (req: Request, res: Response, next: NextFunction) => {
    const userRoleId = getUserRoleIdFromRequest(req,res); // Implement this function to get the user's roleId
    const privilege = await Privileges.findOne({ roleId: userRoleId });

    if (!privilege) {
      handleNoAccess(res,'Access forbidden. You do not have the necessary privilege.')
      return;
    }

    const attribute = privilege.attributes.find(attr => attr.id === attributeId);
    if (!attribute || !attribute.status) {
        handleNoAccess(res,'Access forbidden. You do not have the necessary privilege.')
    } else {
      next();
    }
  };
}

function getUserRoleIdFromRequest(req: Request, res: Response): void {
  // Simulated logic - replace this with your actual user role retrieval
  const user: any = req.headers.authorization;
  if (!user || !user.startsWith('Bearer ')) {
    handleUnauthorized(res,'Authorization token is missing')
    return;
  }

  const auth = user.split(' ')[1]
  const data = verifyToken(auth)
    return user ? data.roleId : '';
}
