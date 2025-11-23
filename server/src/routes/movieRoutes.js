import express from 'express';
import { trending, movie, search, languages, genres, discover } from '../controllers/movieControllers.js';

const router = express.Router();

router.get('/trending', trending);
router.get('/movie', movie);
router.get('/search', search);
router.get('/languages', languages);
router.get('/genres', genres);
router.get('/discover', discover);

export default router;
