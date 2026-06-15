import Review from '../models/Review.js';
import jsonDb from '../config/jsonDb.js';

export const getReviews = async (req, res) => {
  try {
    const { approvedOnly } = req.query;
    if (global.dbFallback) {
      let reviews = jsonDb.get('reviews');
      if (approvedOnly === 'true') {
        reviews = reviews.filter(r => r.isApproved);
      }
      reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(reviews);
    }
    
    let filter = {};
    if (approvedOnly === 'true') {
      filter.isApproved = true;
    }
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { name, rating, comment, imageUrl, isFeatured } = req.body;
    if (!name || rating === undefined || !comment) {
      return res.status(400).json({ message: 'Name, rating, and comment are required' });
    }
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }
    if (global.dbFallback) {
      const newReview = jsonDb.create('reviews', { name, rating: Number(rating), comment, imageUrl: imageUrl || '', isFeatured: Boolean(isFeatured), isApproved: false });
      return res.status(201).json(newReview);
    }
    const newReview = new Review({ name, rating, comment, imageUrl, isFeatured, isApproved: false });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, isFeatured } = req.body;
    
    const updateData = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    
    if (global.dbFallback) {
      const updated = jsonDb.update('reviews', id, updateData);
      if (!updated) return res.status(404).json({ message: 'Review not found' });
      return res.json(updated);
    }
    const updated = await Review.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Review not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (global.dbFallback) {
      const deleted = jsonDb.delete('reviews', id);
      if (!deleted) return res.status(404).json({ message: 'Review not found' });
      return res.json({ message: 'Review deleted' });
    }
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export default { getReviews, createReview, updateReviewStatus, deleteReview };
