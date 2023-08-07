import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import * as encryptionHelpers from '../helpers/encryption';
import { handleServerError, handleBadRequest } from '../helpers/errorHandler';
import { generateUserId } from '../helpers/generator';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, birth, location, email, phoneNumber, ...extraFields } = req.body;
        const loadedSecretKey = encryptionHelpers.loadedSecretKey;

        // Check for additional fields in req.body
        if (Object.keys(extraFields).length > 0) {
            return handleBadRequest(res, 'Additional fields are not allowed');
        }

        const user = new User({
            userId: generateUserId(),
            name,
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
                id: savedUser.userId,
            },
        });
    } catch (error) {
        handleServerError(res, error);
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
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

        const options: any = {
            skip: page ? (parseInt(page) - 1) * parseInt(limit) : 0,
            limit: limit ? parseInt(limit) : 10,
        };

        const [users, userCount] = await Promise.all([
            User.find(query, 'userId name birth location createdAt')
                .sort({ name: 1 })
                .skip(options.skip)
                .limit(options.limit),
            User.countDocuments(query),
        ]);

        const dataUsers = users.map((user: any) => ({
            userId: user.userId,
            name: user.name,
            birth: user.birth,
            location: user.location,
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
        const userId = req.params.userId;
        const user: IUser | null = await User.findOne({ userId });

        if (!user) {
            console.log('User not found for userId:', userId);
            return res.status(404).json({ message: 'User not found' });
        }

        const decryptedUser = {
            userId: user.userId,
            name: user.name,
            birth: user.birth,
            location: user.location,
            email: encryptionHelpers.decrypt(user.email as string, user.loadedSecretKey),
            phoneNumber: encryptionHelpers.decrypt(user.phoneNumber as string, user.loadedSecretKey),
            createdAt: user.createdAt,
        };

        res.status(200).json({
            code: 200,
            message: 'Get User details successfully',
            data: decryptedUser,
        });
    } catch (error) {
        handleServerError(res, error); // Make sure handleServerError is defined
    }
};
