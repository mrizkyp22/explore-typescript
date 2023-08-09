import { Response } from 'express';

export const handleServerError = (res: Response, error: any, statusCode: number = 500) => {
    console.error('An error occurred:', error);
    res.status(statusCode).json({ message: 'An error occurred', error: error.message });
};

export const handleBadRequest = (res: Response, message: string) => {
    return res.status(400).json({ code: 400, message });
};

export const handleNotFound = (res: Response, message: string) => {
    return res.status(404).json({ code: 404, message });
};

export const handleNoAccess = (res: Response, message: string) => {
    return res.status(403).json({ code: 403, message });
};

export const handleUnauthorized = (res: Response, message: string) => {
    return res.status(401).json({ code: 401, message });
};