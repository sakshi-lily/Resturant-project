import MenuItem from '../models/MenuItem.js';
import jsonDb from '../config/jsonDb.js';

export const getMenuItems = async (req, res) => {
  try {
    if (global.dbFallback) {
      const items = jsonDb.get('menuItems');
      return res.json(items);
    }
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, imageUrl, isChefSpecial, allergens } = req.body;
    if (global.dbFallback) {
      const newItem = jsonDb.create('menuItems', { name, description, price: Number(price), category, imageUrl, isChefSpecial: Boolean(isChefSpecial), allergens: allergens || [] });
      return res.status(201).json(newItem);
    }
    const newItem = new MenuItem({ name, description, price, category, imageUrl, isChefSpecial, allergens });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (global.dbFallback) {
      const updated = jsonDb.update('menuItems', id, req.body);
      if (!updated) return res.status(404).json({ message: 'Menu item not found' });
      return res.json(updated);
    }
    const updated = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Menu item not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (global.dbFallback) {
      const deleted = jsonDb.delete('menuItems', id);
      if (!deleted) return res.status(404).json({ message: 'Menu item not found' });
      return res.json({ message: 'Menu item deleted' });
    }
    const deleted = await MenuItem.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Menu item not found' });
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };
