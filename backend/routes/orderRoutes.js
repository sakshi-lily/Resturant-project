import express from 'express';
import { createOrder, getOrders, updateOrderStatus, deleteOrder, getMyOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createOrder); // Public checkout
router.get('/my-orders', protect, getMyOrders);
router.get('/', protect, admin, getOrders);
router.put('/:id', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

export default router;
