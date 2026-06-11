import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, enum: ['Appetizers', 'Mains', 'Desserts', 'Beverages'], required: true },
  imageUrl: { type: String, required: true },
  isChefSpecial: { type: Boolean, default: false },
  allergens: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
