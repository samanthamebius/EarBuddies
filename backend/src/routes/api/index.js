import express from 'express';

const router = express.Router();

// here will import the files for our api

//tester api call
router.get('/hello', (req, res) => {
    res.send('Hello, World');
})

export default router;