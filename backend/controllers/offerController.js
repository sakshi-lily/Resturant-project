import Offer from '../models/Offer.js';
import jsonDb from '../config/jsonDb.js';

export const getOffers = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    if (global.dbFallback) {
      let offers = jsonDb.get('offers');
      if (activeOnly === 'true') {
        offers = offers.filter(o => o.isActive);
      }
      return res.json(offers);
    }
    
    let filter = {};
    if (activeOnly === 'true') {
      filter.isActive = true;
    }
    const offers = await Offer.find(filter).sort({ createdAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOffer = async (req, res) => {
  try {
    const { title, description, discountCode, isActive } = req.body;
    if (global.dbFallback) {
      const newOffer = jsonDb.create('offers', { title, description, discountCode: discountCode || '', isActive: isActive !== undefined ? Boolean(isActive) : true });
      return res.status(201).json(newOffer);
    }
    const newOffer = new Offer({ title, description, discountCode, isActive });
    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const { id } = req.params;
    if (global.dbFallback) {
      const updated = jsonDb.update('offers', id, req.body);
      if (!updated) return res.status(404).json({ message: 'Offer not found' });
      return res.json(updated);
    }
    const updated = await Offer.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Offer not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const { id } = req.params;
    if (global.dbFallback) {
      const deleted = jsonDb.delete('offers', id);
      if (!deleted) return res.status(404).json({ message: 'Offer not found' });
      return res.json({ message: 'Offer deleted' });
    }
    const deleted = await Offer.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Offer not found' });
    res.json({ message: 'Offer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default { getOffers, createOffer, updateOffer, deleteOffer };
