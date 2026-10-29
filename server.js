require('dotenv').config();
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // fallback if environment restricts setting dns servers
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const studentRoutes = require('./routes/studentRoutes');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Service name for scalability demonstration
const SERVICE_NAME = process.env.SERVICE_NAME || process.env.RENDER_SERVICE_NAME || 'RiteshStudentMsystem';

// Root Health & Scalability Route
app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Student API is running perfectly!',
    service: SERVICE_NAME,
    containerStatus: 'Healthy & Scalable',
    tier: 'Tier 2: Application Layer (Render Cloud Container)',
    database: mongoose.connection.readyState === 1 ? 'Connected (MongoDB Atlas)' : 'Connecting...',
    timestamp: new Date().toISOString()
  });
});

// Scalability Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: SERVICE_NAME,
    uptimeSeconds: Math.floor(process.uptime()),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Full System Architecture Info Route
app.get('/api/system-info', (req, res) => {
  res.json({
    success: true,
    serviceName: SERVICE_NAME,
    architectureTier: 'Tier 2: Backend Application Layer',
    cloudPlatform: 'Render Cloud Container',
    scalabilityRole: 'Independent Horizontally Scaled Node',
    databaseTier: 'Tier 3: MongoDB Atlas (studentDB -> students)',
    uptime: `${Math.floor(process.uptime())} seconds`,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/students', studentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 [${SERVICE_NAME}] Server running on port ${PORT}`);
});
