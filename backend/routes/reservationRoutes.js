import express from 'express';
import { getReservations, createReservation, updateReservationStatus, deleteReservation } from '../controllers/reservationController.js';

const router = express.Router();

router.get('/', getReservations);
router.post('/', createReservation);
router.put('/:id', updateReservationStatus);
router.delete('/:id', deleteReservation);

export default router;
