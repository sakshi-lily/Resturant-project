import Subscriber from '../models/Subscriber.js';
import jsonDb from '../config/jsonDb.js';

export const getSubscribers = async (req, res) => {
  try {
    if (global.dbFallback) {
      const subs = jsonDb.get('subscribers');
      return res.json(subs);
    }
    const subs = await Subscriber.find().sort({ subscribedAt: -1 });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSubscriber = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    if (global.dbFallback) {
      const existing = jsonDb.get('subscribers').find(s => s.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: 'Email is already subscribed' });
      }
      const newSub = jsonDb.create('subscribers', { email: email.toLowerCase() });
      return res.status(201).json(newSub);
    }
    
    const newSub = new Subscriber({ email: email.toLowerCase() });
    await newSub.save();
    res.status(201).json(newSub);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email is already subscribed' });
    }
    res.status(400).json({ message: error.message });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    if (global.dbFallback) {
      const deleted = jsonDb.delete('subscribers', id);
      if (!deleted) return res.status(404).json({ message: 'Subscriber not found' });
      return res.json({ message: 'Subscriber unsubscribed' });
    }
    const deleted = await Subscriber.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Subscriber not found' });
    res.json({ message: 'Subscriber unsubscribed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default { getSubscribers, createSubscriber, deleteSubscriber };
