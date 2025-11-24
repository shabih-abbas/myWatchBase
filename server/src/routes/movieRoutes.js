import express from 'express';
import { trending, movie, search, filters, discover } from '../controllers/movieControllers.js';

const router = express.Router();

router.get('/trending', trending);
router.get('/movie', movie);
router.get('/search', search);
router.get('/filters', filters);
router.get('/discover', discover);

export default router;
