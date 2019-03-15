import mongoose from 'mongoose';

export const connectToDb = async () => {
    const cs = process.env.CS || '';
    try {
        await mongoose.connect(cs, { useNewUrlParser: true });
        mongoose.Promise = global.Promise;
        console.log('Connected to db');
    } catch (err) {
        console.error('Error connecting to db. ', err);
    }
};