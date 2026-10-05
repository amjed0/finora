import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import financeRoutes from './routes/financeRoutes.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Finora MongoDB Backend Express Server is active' });
});

export default app;
