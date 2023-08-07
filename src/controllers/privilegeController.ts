import { Request, Response } from 'express';
import Privilege from '../models/privilegeModel'; // Import the model without interface import
import { handleServerError, handleBadRequest, handleNotFound, handleNoAccess } from '../helpers/errorHandler';


export const getPrivileges = async (req: Request, res: Response) => {
  try {
    const privileges = await Privilege.find(); // No need to use IPrivilege here

    const formattedPrivileges = privileges.map(privilege => ({
        roleId: privilege.roleId,
        // attributes: privilege.attributes.map(attr => ({
        //   id: attr.id,
        //   status: attr.status
        // }))
      }));

    const response = {
      code: 200,
      message: 'Get privileges successfully',
      data: formattedPrivileges,
    };

    res.status(200).json(response);
  } catch (error) {
    handleServerError(res, error);
}
};

export const getPrivilegeDetail = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;

    const privilege = await Privilege.findOne({ roleId });

    if (!privilege) {
      handleNotFound(res, 'Privilege not found');
      return;
    }

    const formattedPrivilege = {
      roleId: privilege.roleId,
      attributes: privilege.attributes.map(attr => ({
        id: attr.id,
        status: attr.status,
      })),
    };

    const response = {
      code: 200,
      message: 'Get privilege detail successfully',
      privilege: formattedPrivilege,
    };

    res.status(200).json(response);
  } catch (error) {
    handleServerError(res, error);
  }
};
