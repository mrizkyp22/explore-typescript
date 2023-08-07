import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import * as encryptionHelpers from '../helpers/encryption';
import { handleServerError, handleBadRequest, handleNotFound, handleNoAccess } from '../helpers/errorHandler';
import { generateUserId } from '../helpers/generator';
import { checkPrivileges } from '../helpers/privilege';
import { Privileges, Attribute  } from '../models/attributesTypes';
import { mockPrivilege } from '../models/mockUser';
import Privilege, {IPrivilege} from '../models/privilegeModel';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const privilegeDocument: Privileges | null = await Privilege.findOne();
        // Use the mock privilege if not found in the database
        const privilegeAttributes: Attribute[] = privilegeDocument?.attributes || mockPrivilege.attributes;
        const hasCreateUserPrivilege = checkPrivileges(privilegeAttributes, 'create_new_user');

        if (!hasCreateUserPrivilege) {
            return handleNoAccess(res, 'Access forbidden. You do not have the necessary privilege.');
        }

        const { name, roleId, birth, location, email, phoneNumber, ...extraFields } = req.body;
        const loadedSecretKey = encryptionHelpers.loadedSecretKey;

        if (Object.keys(extraFields).length > 0) {
            return handleBadRequest(res, 'Additional fields are not allowed');
        }

        const user = new User({
            userId: generateUserId(),
            name,
            roleId,
            birth,
            location,
            email: encryptionHelpers.encrypt(email),
            phoneNumber: encryptionHelpers.encrypt(phoneNumber),
            createdAt: new Date().toISOString(),
            loadedSecretKey,
        });

        const validationError = user.validateSync();
        if (validationError) {
            return res.status(400).json({ message: 'Validation error', error: validationError });
        }

        const savedUser = await user.save();

        res.status(201).json({
            code: 201,
            message: 'User registered successfully',
            data: {
                userId: savedUser.userId,
            },
        });
    } catch (error) {
        handleServerError(res, error);
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const privilegeDocument: Privileges | null = await Privilege.findOne();
        // Use the mock privilege if not found in the database
        const privilegeAttributes: Attribute[] = privilegeDocument?.attributes || mockPrivilege.attributes;

        // Check if the user has the required attribute
        const hasReadListUserPrivilege = checkPrivileges(privilegeAttributes, 'read_list_user');

        if (!hasReadListUserPrivilege) {
            return handleNoAccess(res, 'Access forbidden. You do not have the necessary privilege.');
        }

        const { search, page, limit, ...otherQueries } = req.query as {
            search: string;
            page: string;
            limit: string;
            [key: string]: string | string[];
        };

        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }

        if (Object.keys(otherQueries).length > 0) {
            return handleBadRequest(res, 'Additional queries are not allowed');
        }

        const options = {
            skip: page ? (parseInt(page) - 1) * parseInt(limit) : 0,
            limit: limit ? parseInt(limit) : 10,
        };

        const [users, userCount] = await Promise.all([
            User.find(query, 'userId name roleId birth location createdAt')
                .sort({ name: 1 })
                .skip(options.skip)
                .limit(options.limit),
            User.countDocuments(query),
        ]);

        const dataUsers = users.map((user: IUser) => ({
            userId: user.userId,
            name: user.name,
        }));

        res.status(200).json({
            code: 200,
            message: 'Get Users successfully',
            data: dataUsers,
            totalData: userCount,
            currentPage: page ? parseInt(page) : 1,
            totalPages: Math.ceil(userCount / options.limit),
        });
    } catch (error) {
        handleServerError(res, error);
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const privilegeDocument: IPrivilege | null = await Privilege.findOne();
        // Use the mock privilege if not found in the database
        const privilegeAttributes: Attribute[] = privilegeDocument?.attributes || mockPrivilege.attributes;

        // Check if the user has the required attribute
        const hasReadDetailUserPrivilege = checkPrivileges(privilegeAttributes, 'read_detail_user');

        if (!hasReadDetailUserPrivilege) {
            return handleNoAccess(res, 'Access forbidden. You do not have the necessary privilege.');
        }

        const userId = req.params.userId;
        const user: IUser | null = await User.findOne({ userId });

        if (!user) {
            console.log('User not found for userId:', userId);
            return handleNotFound(res, 'User not found');
        }

        const getUsers = (user: IUser) => ({
            userId: user.userId,
            name: user.name,
            birth: user.birth,
            location: user.location,
            email: encryptionHelpers.decrypt(user.email as string, user.loadedSecretKey),
            phoneNumber: encryptionHelpers.decrypt(user.phoneNumber as string, user.loadedSecretKey),
            createdAt: user.createdAt,
            privileges: user.privilege
        });

        res.status(200).json({
            code: 200,
            message: 'Get User details successfully',
            data: getUsers(user),
        });

    } catch (error) {
        handleServerError(res, error);
    }
};