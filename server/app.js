import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import generateRoutes from './routes/generate.js';
import songRoutes from './routes/songs.js';
import voiceRoutes from './routes/voice.js';

// Worker
import { initWorker } from './queues/musicQueue.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';

// Socket
import { initSocket } from './socket/progressSocket.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// CORS Config
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors());

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

initSocket(io);
initWorker(io);

// Pass io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/voice', voiceRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Studio AI API is running' });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 4300;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, httpServer, io };
