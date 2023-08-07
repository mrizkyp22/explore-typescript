// custom.d.ts
import { UserAttributes } from '../models/attributesTypes';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            attributes: UserAttributes;
        };
    }
}