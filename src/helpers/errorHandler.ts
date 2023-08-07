import { Response } from 'express';

export const handleServerError = (res: Response, error: any, statusCode: number = 500) => {
    console.error('An error occurred:', error);
    res.status(statusCode).json({ message: 'An error occurred', error: error.message });
};

export const handleBadRequest = (res: Response, message: string) => {
    return res.status(400).json({ code: 400, message });
};