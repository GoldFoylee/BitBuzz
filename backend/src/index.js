const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const { initSocket } = require('./socket/index');
const errorMiddleware = require('./middleware/errorMiddleware');

const authRoutes = require('./routes/auth');
const marketRoutes = require('./routes/markets');
const tradeRoutes = require('./routes/trades');
const leaderboardRoutes = require('./routes/leaderboard');

const app = express();
const server = http.createServer(app);

// Init Socket.io
initSocket(server);

const allowedOrigins = ['http://localhost:5173', 'https://[HOSTED LINK]', process.env.FRONTEND_URL];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/trades', tradeRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Global Error Handler
app.use(errorMiddleware);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
