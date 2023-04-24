import express from 'express';

const router = express.Router();

import login from './login';
router.use('/login', login);

import refresh from './refresh';
router.use('/refresh', refresh);

import user from './user';
router.use('/user', user);

import music from './music';
router.use('/music', music);

//tester api call
router.get('/hello', (req, res) => {
    res.send('Hello, World');
})

export default router;