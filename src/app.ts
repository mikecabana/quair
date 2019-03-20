import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import exphbs from 'express-handlebars';

import { connectToDb } from './data/db';
import { userRouter } from './routes/users';
import { questionRouter } from './routes/questions';
import { seedDb } from './data/seed';
import { HttpStatus } from './helpers/http-status';
import { User } from './models/user';
import { Question } from './models/questions';

dotenv.config();

const PORT = process.env.PORT || 3000;

connectToDb();
seedDb();

const app = express();

app.set('views', 'src/views');

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: 'src/views/layouts',
    partialsDir: 'src/views/partials',
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

app.get('/', async (req, res) => {
    res.render('home');
});

app.post('/', async (req, res) => {

    const { name } = req.body;

    if (!name) {
        return res.redirect('/');
    }

    const user = new User({ name });

    try {
        await user.save();
        return res.redirect('/test?id=' + user._id);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

app.get('/test', async (req, res) => {

    const { id } = req.query;

    if (!id) {
        return res.redirect('/');
    }

    const questions = await Question.find();

    res.render('test', {
        id,
        questions,
    });
});

app.post('/test', async (req, res) => {
    const { body } = req;

    const userId = body.userId;

    const scores: number[] = [];
    const keys = Object.keys(body);
    keys.splice(keys.indexOf('userId'), 1);

    let questions;
    try {
        questions = await Question.where('_id').in(keys);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('error getting questions for calculation');
    }

    questions.forEach((q: any) => {
        if (q) {
            const score = body[q._id];
            scores.push(q.value * score);
        }
    });


    if (scores.length === 0) {
        return res.redirect('/');
    }

    const sum = scores.reduce((s, i) => s = s + i, 0);
    const average = sum / scores.length;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('error getting user for scoring');
    }

    if (user) {
        user.score = average;
        try {
            await user.save();
        } catch (err) {
            console.error(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('error updating user score');
        }
    }

    res.render('score', {
        average,
        user,
    });
});

app.get('/leaderboard', async (req, res) => {

    let users;
    try {
        users = await User.where('score').ne(null).sort('-score');
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('error getting users for leaderboard');
    }

    if (!users || userRouter.length === 0) {
        return res.status(HttpStatus.NO_CONTENT);
    }

    res.render('leaderboard', {
        users,
    });

});

app.use('/users', userRouter);
app.use('/ ', questionRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});