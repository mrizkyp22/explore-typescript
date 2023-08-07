import { Privileges } from './attributesTypes';

export const mockPrivilege: Privileges = {
    attributes: [
        {
            id: 'read_list_user',
            status: true,
        },
        {
            id: 'read_detail_user',
            status: true,
        },
        {
            id: 'create_new_user',
            status: true,
        }
        // Add other attributes as needed
    ],
};