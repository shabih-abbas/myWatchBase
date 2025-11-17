import express from 'express';
import { trending, movie, search } from '../controllers/movieControllers.js';

const router = express.Router();

router.get('/trending', trending);
router.get('/movie', movie);
router.get('/search', search);

export default router;
