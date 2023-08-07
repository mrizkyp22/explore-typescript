// abac.ts
import { UserAttributes } from "../models/attributesTypes";

export const checkPrivileges = (userAttributes: UserAttributes, requiredAttribute: string): boolean => {
    return userAttributes[requiredAttribute] === true;
};
