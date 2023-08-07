// custom.d.ts
import { UserAttributes } from './types';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            attributes: UserAttributes;
        };
    }
}
