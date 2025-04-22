import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Get all orders for a user
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 