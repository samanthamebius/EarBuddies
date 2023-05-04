import express from "express";

var router = express.Router();

import api from './api';
router.use('/api', api);

export default router;