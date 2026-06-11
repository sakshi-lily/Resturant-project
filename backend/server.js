import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import menuRoutes from './routes/menuRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import subscriberRoutes from './routes/subscriberRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import offerRoutes from './routes/offerRoutes.js';

dotenv.config();

// Connect Database
await connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/menu', menuRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/offers', offerRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: global.dbFallback ? 'local-json' : 'mongodb',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${global.dbFallback ? 'LOCAL JSON FALLBACK' : 'MONGODB'} mode.`);
});
export default app;
