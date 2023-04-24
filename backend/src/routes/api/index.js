import express from 'express';

const router = express.Router();

import login from './login';
router.use('/login', login);

import refresh from './refresh';
router.use('/refresh', refresh);

import user from './user';
router.use('/user', user);

import spotify from './spotify';
router.use('/spotify', spotify);

//tester api call
router.get('/hello', (req, res) => {
    res.send('Hello, World');
})

export default router;