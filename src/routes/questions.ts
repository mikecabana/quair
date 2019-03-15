import express from 'express';
import { HttpStatus } from '../helpers/http-status';
import { Question } from '../models/questions';

export const questionRouter = express.Router();

questionRouter.get('/', async (req, res) => {

    let users;
    try {
        users = await Question.find();
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!users) {
        return res.status(HttpStatus.NO_CONTENT);
    }

    return res.status(HttpStatus.OK).json(users);
});

questionRouter.get('/:id', async (req, res) => {

    const { id } = req.query;

    let question;
    try {
        question = await Question.findById(id);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!question) {
        return res.status(HttpStatus.NO_CONTENT);
    }

    return res.status(HttpStatus.OK).json(question);
});

questionRouter.post('/', async (req, res) => {

    const { q, value } = req.body;

    if (!q && !value) {
        return res.status(HttpStatus.BAD_REQUEST).json('missing question or value');
    }

    const question = new Question({
        q,
        value,
    });

    try {
        await question.save();
    } catch (err) {
        console.error();
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return res.status(HttpStatus.CREATED).json(question);
});

questionRouter.put('/:id', async (req, res) => {

    const { id } = req.query;

    if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json('missing question id');
    }

    let question;

    try {
        question = await Question.findById(id);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }


    if (!question) {
        return res.status(HttpStatus.NOT_FOUND).json('no question with that id');
    }

    const { q, value } = req.body;

    if (!q && !value) {
        return res.status(HttpStatus.BAD_REQUEST).json('missing question or value');
    }

    question.q = q;
    question.value = value;

    try {
        await question.save();
        return res.status(HttpStatus.ACCEPTED).json(question);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

questionRouter.delete('/:id', (req, res) => {

    const { id } = req.query;

    if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json('missing question id');
    }

    try {
        Question.findByIdAndDelete(id);
        return res.status(HttpStatus.NO_CONTENT);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

