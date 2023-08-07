// abac.ts
import { UserAttributes } from "./types";

export const checkPrivileges = (userAttributes: UserAttributes, requiredAttribute: string): boolean => {
    return userAttributes[requiredAttribute] === true;
};
