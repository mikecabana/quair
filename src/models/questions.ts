import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    q: {
        required: true,
        type: String,
    },
    value: {
        required: true,
        type: Number,
    },
});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

export interface IQuestion extends mongoose.Document {
    q: string;
    value: number;
}