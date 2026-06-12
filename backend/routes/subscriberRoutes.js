import express from 'express';
import { getSubscribers, createSubscriber, deleteSubscriber } from '../controllers/subscriberController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getSubscribers);
router.post('/', createSubscriber);
router.delete('/:id', protect, admin, deleteSubscriber);

export default router;

