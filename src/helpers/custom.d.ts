// custom.d.ts
import { Privileges } from '../models/attributesTypes';

declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            attributes: Privileges;
        };
    }
}