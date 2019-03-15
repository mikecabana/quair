import { Question } from '../models/questions';


const questionsToSeed = [
    { q: 'Who?', value: 100 },
    { q: 'What?', value: 100 },
    { q: 'When?', value: 100 },
    { q: 'Where?', value: 100 },
    { q: 'Why?', value: 100 },
];

export const seedDb = async () => {

    let questions;
    try {
        questions = await Question.find();
    } catch (err) {
        console.error(err);
    }

    if (!questions || questions.length === 0) {

        questionsToSeed.forEach(
            async (q) => {
                const question = new Question(q);
                try {
                    await question.save();
                } catch (err) {
                    console.error(err);
                }
            },
        );
    }

};