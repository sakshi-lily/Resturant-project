import Reservation from '../models/Reservation.js';
import jsonDb from '../config/jsonDb.js';

export const getReservations = async (req, res) => {
  try {
    if (global.dbFallback) {
      const bookings = jsonDb.get('reservations');
      return res.json(bookings);
    }
    const bookings = await Reservation.find().sort({ date: 1, time: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReservation = async (req, res) => {
  try {
    const { name, email, phone, date, time, guests, seatingArea } = req.body;
    if (global.dbFallback) {
      const newBooking = jsonDb.create('reservations', { name, email, phone, date: new Date(date).toISOString(), time, guests: Number(guests), seatingArea, status: 'Pending' });
      return res.status(201).json(newBooking);
    }
    const newBooking = new Reservation({ name, email, phone, date, time, guests, seatingArea });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateReservationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (global.dbFallback) {
      const updated = jsonDb.update('reservations', id, { status });
      if (!updated) return res.status(404).json({ message: 'Reservation not found' });
      return res.json(updated);
    }
    const updated = await Reservation.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Reservation not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    if (global.dbFallback) {
      const deleted = jsonDb.delete('reservations', id);
      if (!deleted) return res.status(404).json({ message: 'Reservation not found' });
      return res.json({ message: 'Reservation deleted' });
    }
    const deleted = await Reservation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Reservation not found' });
    res.json({ message: 'Reservation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyReservations = async (req, res) => {
  try {
    if (global.dbFallback) {
      const bookings = jsonDb.get('reservations');
      const myBookings = bookings.filter(b => b.email === req.user.email);
      // Sort by date then time desc
      const sorted = [...myBookings].sort((a, b) => new Date(b.date) - new Date(a.date));
      return res.json(sorted);
    }

    const myBookings = await Reservation.find({ email: req.user.email }).sort({ date: 1, time: 1 });
    res.json(myBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getReservations, createReservation, updateReservationStatus, deleteReservation, getMyReservations };
