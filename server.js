const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Koneksi ke MongoDB (opsional)
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  console.log('Mencoba menghubungkan ke MongoDB...');
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Terhubung ke MongoDB'))
    .catch(err => console.log('⚠️  Tidak bisa terhubung ke MongoDB:', err.message));
} else {
  console.log('⚠️  MONGODB_URI tidak ditemukan, menjalankan tanpa database');
}

// Route dasar
app.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({ 
    message: 'Indiego.Net Backend API is running!',
    status: 'OK',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({ 
    status: 'OK', 
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
