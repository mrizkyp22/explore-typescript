// controllers/privilegeController.ts

import { Request, Response } from 'express';
import Privilege from '../models/privilegeModel'; // Import the model without interface import
import { handleServerError, handleBadRequest, handleNotFound, handleNoAccess } from '../helpers/errorHandler';


export const getPrivileges = async (req: Request, res: Response) => {
  try {
    const privileges = await Privilege.find(); // No need to use IPrivilege here

    const formattedPrivileges = privileges.map(privilege => ({
        roleId: privilege.roleId,
        attributes: privilege.attributes.map(attr => ({
          id: attr.id,
          status: attr.status
        }))
      }));

    const response = {
      code: 200,
      message: 'Get privileges successfully',
      privileges: formattedPrivileges,
    };

    res.status(200).json(response);
  } catch (error) {
    handleServerError(res, error);
}
};
