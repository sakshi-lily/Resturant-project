import express from 'express';
import { getReviews, createReview, updateReviewStatus, deleteReview } from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getReviews);
router.post('/', createReview);
router.put('/:id', protect, admin, updateReviewStatus);
router.delete('/:id', protect, admin, deleteReview);

export default router;

