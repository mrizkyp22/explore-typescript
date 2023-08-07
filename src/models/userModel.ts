import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
  userId: string
  name: string;
  birth: Date;
  location: string;
  email: String;
  phoneNumber: String;
  createdAt: Date
  loadedSecretKey: Buffer
}

const userSchema = new Schema<IUser>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  birth: { type: Date, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  createdAt: { type: Date, required: true },
  loadedSecretKey: { type: Buffer, required: true },
},
  {
    versionKey: false, // This removes the "__v" field from documents
    collection: 'users'
  }
);

export default model<IUser>('User', userSchema);