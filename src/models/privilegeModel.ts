import { Document, Schema, model } from 'mongoose';

export interface IAttribute {
  id: string;
  status: boolean;
}

export interface IPrivilege extends Document {
  roleId: string;
  attributes: IAttribute[];
}

const privilegeSchema = new Schema<IPrivilege>({
  roleId: { type: String, required: true },
  attributes: [
    {
      id: { type: String, required: true },
      status: { type: Boolean, required: true },
    },
  ],
},
{
  versionKey: false, // This removes the "__v" field from documents
  collection: 'privileges'
});

export default model<IPrivilege>('Privilege', privilegeSchema);