import mongoose, { Document } from 'mongoose';

interface IAttribute {
  id: string;
  status: boolean;
}

interface IPrivilege extends Document {
  roleId: string;
  attributes: IAttribute[];
}

const privilegeSchema = new mongoose.Schema({
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

const Privilege = mongoose.model<IPrivilege>('Privilege', privilegeSchema);

export default Privilege;