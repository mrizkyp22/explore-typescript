// abac.ts
import {Attribute } from "../models/attributesTypes";

export const checkPrivileges = (privilegeAttributes: Attribute[], requiredAttribute: string): boolean => {
    const attribute = privilegeAttributes.find(attr => attr.id === requiredAttribute);

    return attribute ? attribute.status === true : false;
};