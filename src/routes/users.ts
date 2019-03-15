import express from 'express';
import { HttpStatus } from '../helpers/http-status';
import { User } from '../models/user';

export const userRouter = express.Router();

userRouter.get('/', async (req, res) => {

    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!users) {
        return res.status(HttpStatus.NO_CONTENT);
    }

    return res.status(HttpStatus.OK).json(users);
});

userRouter.get('/:id', async (req, res) => {

    const { id } = req.query;

    let user;
    try {
        user = await User.findById(id);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!user) {
        return res.status(HttpStatus.NO_CONTENT);
    }

    return res.status(HttpStatus.OK).json(user);
});

userRouter.post('/', async (req, res) => {

    const { name } = req.body;

    if (!name) {
        return res.status(HttpStatus.BAD_REQUEST).json('missing name');
    }

    const user = new User({
        name,
    });

    try {
        await user.save();
    } catch (err) {
        console.error();
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return res.status(HttpStatus.CREATED).json(user);
});

userRouter.put('/:id', async (req, res) => {

    const { id } = req.query;

    if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json('missing user id');
    }

    let user;

    try {
        user = await User.findById(id);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }


    if (!user) {
        return res.status(HttpStatus.NOT_FOUND).json('no user with that id');
    }

    const { name, score } = req.body;

    if (!name && !score) {
        return res.status(HttpStatus.BAD_REQUEST).json('missing user name or score');
    }

    user.name = name;
    user.score = score;

    try {
        await user.save();
        return res.status(HttpStatus.ACCEPTED).json(user);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

userRouter.delete('/:id', (req, res) => {

    const { id } = req.query;

    if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json('missing user id');
    }

    try {
        User.findByIdAndDelete(id);
        return res.status(HttpStatus.NO_CONTENT);
    } catch (err) {
        console.error(err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
});

