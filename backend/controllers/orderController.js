import Order from '../models/Order.js';
import jsonDb from '../config/jsonDb.js';

export const createOrder = async (req, res) => {
  try {
    const { customerName, email, phone, deliveryAddress, items, totalAmount } = req.body;

    if (!customerName || !email || !phone || !deliveryAddress || !items || !items.length || !totalAmount) {
      return res.status(400).json({ message: 'All order fields are required' });
    }

    if (global.dbFallback) {
      const newOrder = jsonDb.create('orders', {
        customerName,
        email,
        phone,
        deliveryAddress,
        items,
        totalAmount: Number(totalAmount),
        status: 'Pending'
      });
      return res.status(201).json(newOrder);
    }

    // MongoDB Mode
    const newOrder = new Order({
      customerName,
      email,
      phone,
      deliveryAddress,
      items,
      totalAmount
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    if (global.dbFallback) {
      const orders = jsonDb.get('orders');
      // Sort by createdAt desc
      const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(sorted);
    }

    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    if (global.dbFallback) {
      const updated = jsonDb.update('orders', id, { status });
      if (!updated) return res.status(404).json({ message: 'Order not found' });
      return res.json(updated);
    }

    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (global.dbFallback) {
      const deleted = jsonDb.delete('orders', id);
      if (!deleted) return res.status(404).json({ message: 'Order not found' });
      return res.json({ message: 'Order deleted' });
    }

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { createOrder, getOrders, updateOrderStatus, deleteOrder };
