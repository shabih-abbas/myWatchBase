import express from 'express';
import { trending, movie } from '../controllers/movieControllers.js';

const router = express.Router();

router.get('/trending', trending);
router.get('/movie', movie);

export default router;
