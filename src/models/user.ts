import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    score: {
        required: false,
        type: Number,
    },
});

export const User = mongoose.model<IUser>('User', UserSchema);

export interface IUser extends mongoose.Document {
    name: string;
    score: number;
}