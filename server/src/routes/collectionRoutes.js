import express from 'express';
import protect from '../middlewares/protect.js ';
import { create, deleteCollection, addMovie, deleteMovie, getCollections } from '../controllers/collectionControllers.js';

const router = express.Router();

router.use(protect);

router.get('/list', getCollections);
router.post('/create', create);
router.delete('/delete/:collection', deleteCollection);
router.patch('/add-movie', addMovie);
router.patch('/delete-movie', deleteMovie);

export default router;
