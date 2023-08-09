import { Document, Schema, model, Types } from 'mongoose';

export interface IAuth extends Document {
  username: string;
  password: string;
  roleId: string;
  accessToken: string
}

export const authSchema = new Schema<IAuth>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roleId: { type: String, required: true },
  accessToken: { type: String, required: true },
},
{
    versionKey: false,
    collection: 'auth'
});

export default model<IAuth>('Auth', authSchema);