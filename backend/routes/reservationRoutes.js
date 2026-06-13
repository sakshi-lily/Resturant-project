import express from 'express';
import { getReservations, createReservation, updateReservationStatus, deleteReservation, getMyReservations } from '../controllers/reservationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-reservations', protect, getMyReservations);
router.get('/', protect, admin, getReservations);
router.post('/', createReservation);
router.put('/:id', protect, admin, updateReservationStatus);
router.delete('/:id', protect, admin, deleteReservation);

export default router;

