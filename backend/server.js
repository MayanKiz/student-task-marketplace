const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io Configuration
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingInterval: 25000,
  pingTimeout: 60000,
});

// ===================== MIDDLEWARE =====================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===================== MONGODB CONNECTION =====================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// ===================== ROUTES =====================
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/tasks', require('./src/routes/tasks'));
app.use('/api/notes', require('./src/routes/notes'));
app.use('/api/chat', require('./src/routes/chat'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/notifications', require('./src/routes/notifications'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ===================== SOCKET.IO EVENTS =====================
require('./src/socket/events')(io);

// ===================== ERROR HANDLER =====================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    status: err.status || 500,
  });
});

// ===================== 404 HANDLER =====================
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ===================== START SERVER =====================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 Server Running Successfully        ║
║  Port: ${PORT}                         ║
║  Environment: ${process.env.NODE_ENV || 'development'}              ║
║  Socket.io: Enabled                    ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = { app, server, io };
