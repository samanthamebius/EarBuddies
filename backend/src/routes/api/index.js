import express from 'express';

const router = express.Router();

import login from './login';
router.use('/login', login);

//tester api call
router.get('/hello', (req, res) => {
    res.send('Hello, World');
})

export default router;