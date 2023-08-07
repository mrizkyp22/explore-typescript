import { Document, Schema, model, Types } from 'mongoose';
import Privilege, { IPrivilege } from './privilegeModel'; // Import the Privilege model

export interface IUser extends Document {
  userId: string;
  name: string;
  privilege: Types.ObjectId | IPrivilege; // Reference to Privilege model
  birth: Date;
  location: string;
  email: string; // Fix the type name to lowercase 'string'
  phoneNumber: string; // Fix the type name to lowercase 'string'
  createdAt: Date;
  loadedSecretKey: Buffer;
}

const userSchema = new Schema<IUser>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  privilege: { type: Schema.Types.ObjectId, ref: 'Privilege' }, // Reference to Privilege model
  birth: { type: Date, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, required: true },
  loadedSecretKey: { type: Buffer, required: true }
},
{
  versionKey: false,
  collection: 'users'
});

export default model<IUser>('User', userSchema);
