import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
    answer: {
        required: true,
        type: String,
    },
    isCorrect: {
        require: true,
        type: Boolean,
    },
});

export const Answer = mongoose.model<IAnswers>('Answer', AnswerSchema);


const QuestionSchema = new mongoose.Schema({
    answers: {
        required: true,
        type: [AnswerSchema],
    },
    q: {
        required: true,
        type: String,
    },
    value: {
        default: 100,
        required: true,
        type: Number,
    },
});

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);

export interface IQuestion extends mongoose.Document {
    q: string;
    value: number;
    answers: IAnswers[];
}

export interface IAnswers extends mongoose.Document {
    answer: string;
    isCorrect: boolean;
} 