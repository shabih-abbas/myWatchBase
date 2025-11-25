import express from 'express';
import protect from '../middlewares/protect.js ';
import { create, deleteCollection, addMovie, deleteMovie, getCollections } from '../controllers/collectionControllers.js';

const router = express.Router();

router.get('/collections-list', getCollections);
router.use(protect);
router.post('/create', create);
router.delete('/delete', deleteCollection);
router.patch('/add-movie', addMovie);
router.patch('/delete-movie', deleteMovie);

export default router;
