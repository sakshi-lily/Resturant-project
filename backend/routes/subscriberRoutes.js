import express from 'express';
import { getSubscribers, createSubscriber, deleteSubscriber } from '../controllers/subscriberController.js';

const router = express.Router();

router.get('/', getSubscribers);
router.post('/', createSubscriber);
router.delete('/:id', deleteSubscriber);

export default router;
