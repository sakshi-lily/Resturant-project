import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  seatingArea: { type: String, enum: ['Indoor Main Room', 'Outdoor Garden Patio', 'Chef\'s Table'], default: 'Indoor Main Room' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
