import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import * as encryptionHelpers from '../middlewares/encryption';
import { handleServerError, handleBadRequest, handleNotFound, handleNoAccess } from '../utils/errorHandler';
import { generateUserId } from '../utils/generator';
import Privilege, { IPrivilege } from '../models/privilegeModel';

const encryptUserFields = (user: IUser) => {
        user.email = encryptionHelpers.encrypt(user.email);
        user.phoneNumber = encryptionHelpers.encrypt(user.phoneNumber);
}

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, roleId, birth, location, email, phoneNumber, ...extraFields } = req.body;
        const loadedSecretKey = encryptionHelpers.loadedSecretKey;

        if (Object.keys(extraFields).length > 0) {
            return handleBadRequest(res, 'Additional fields are not allowed');
        }

        const user: IUser = new User({
            userId: generateUserId(),
            name,
            roleId,
            birth,
            location,
            email: email,
            phoneNumber: phoneNumber,
            createdAt: new Date().toISOString(),
            loadedSecretKey,
        });

        encryptUserFields(user);

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
                roleid: savedUser.roleId,
            },
        });
    } catch (error) {
        handleServerError(res, error);
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const { search, page, limit, sortBy, sortOrder, isSecure, ...otherQueries } = req.query as {
            search: string;
            page: string;
            limit: string;
            sortBy: string; // New query parameter for sorting by
            sortOrder: 'asc' | 'desc'; // New query parameter for sorting order
            isSecure: 'true' | 'false';
            [key: string]: string | string[];
        };

        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }

        if (isSecure === 'true') {
            query.loadedSecretKey = { $exists: true };
        } else if (isSecure === 'false') {
            query.loadedSecretKey = { $exists: false };
        }

        if (Object.keys(otherQueries).length > 0) {
            return handleBadRequest(res, 'Additional queries are not allowed');
        }

        const options = {
            skip: page ? (parseInt(page) - 1) * parseInt(limit) : 0,
            limit: limit ? parseInt(limit) : 10,
        };

        const sort: any = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }

        const [users, userCount] = await Promise.all([
            User.find(query, 'userId name roleId birth location loadedSecretKey createdAt')
                .sort(sort)
                .skip(options.skip)
                .limit(options.limit),
            User.countDocuments(query),
        ]);

        const dataUsers = users.map((user: IUser) => {
            const isSecure = !!user.loadedSecretKey;
            return {
                userId: user.userId,
                name: user.name,
                roleid: user.roleId,
                isSecure: isSecure,
            };
        });

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
        const userId = req.params.userId;
        const user: IUser | null = await User.findOne({ userId });

        if (!user) {
            console.log('User not found for userId:', userId);
            return handleNotFound(res, 'User not found');
        }

        const privilegeAttribute = await Privilege.findOne({ roleId: user.roleId });
        const dataPrivileges = privilegeAttribute ? {
            attributes: privilegeAttribute.attributes.map(attr => ({
                id: attr.id,
                status: attr.status,
            })),
        } : null;

        const dataUsers = (user: IUser) => {
            const isSecure = !!user.loadedSecretKey;

            const userData: any = {
                isSecure: isSecure,
                userId: user.userId,
                name: user.name,
                roleId: user.roleId,
                birth: user.birth,
                location: user.location,
                createdAt: user.createdAt,
                privilege: dataPrivileges,
            };

            if (isSecure) {
                userData.email = encryptionHelpers.decrypt(user.email as string, user.loadedSecretKey);
                userData.phoneNumber = encryptionHelpers.decrypt(user.phoneNumber as string, user.loadedSecretKey);
            }

            return userData;
        };

        res.status(200).json({
            code: 200,
            message: 'Get User details successfully',
            data: dataUsers(user),
        });

    } catch (error) {
        handleServerError(res, error);
    }
};