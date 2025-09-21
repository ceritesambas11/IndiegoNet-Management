const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
    origin: 'https://ceritesambas11.github.io',
    credentials: true
}));
app.use(express.json());

// Koneksi MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('Tidak bisa terhubung ke MongoDB:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from IndiegoNet Backend!');
});

// ==================== API ROUTES ====================

// 1. Route Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔐 Login attempt:', username);

    // Validasi login
    if (username === 'admin' && password === 'admin123') {
      res.json({
        success: true,
        message: 'Login berhasil',
        user: {
          username: 'admin',
          name: 'Administrator',
          role: 'admin'
        },
        token: 'demo-jwt-token-123456'
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Username atau password salah'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error server: ' + error.message
    });
  }
});

// 2. Get All Users
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    users: [
      { username: 'admin', name: 'Administrator', role: 'admin' },
      { username: 'tokoA', name: 'Toko A', role: 'user' },
      { username: 'tokoB', name: 'Toko B', role: 'user' },
      { username: 'budi', name: 'Budi', role: 'user' }
    ]
  });
});

// 3. Get All Customers
app.get('/api/customers', (req, res) => {
  res.json({
    success: true,
    customers: [
      { id: 1, nama: 'Toko A', jenis: 'Toko', persen: 20 },
      { id: 2, nama: 'Toko B', jenis: 'Toko', persen: 25 },
      { id: 3, nama: 'Budi', jenis: 'Pribadi', tagihanPribadi: 50000 }
    ]
  });
});

// 4. Get All Deliveries
app.get('/api/deliveries', (req, res) => {
  res.json({
    success: true,
    deliveries: [
      { id: 1, tgl: '2024-01-15', nama: 'Toko A', v2: 100, v5: 50 },
      { id: 2, tgl: '2024-01-16', nama: 'Toko B', v2: 80, v5: 30 }
    ]
  });
});

// 5. Get All Billings
app.get('/api/billings', (req, res) => {
  res.json({
    success: true,
    billings: [
      { id: 1, tglPenagihan: '2024-01-20', nama: 'Toko A', totalTagihan: 450000 },
      { id: 2, tglPenagihan: '2024-01-21', nama: 'Toko B', totalTagihan: 320000 }
    ]
  });
});

// 6. Get All Messages
app.get('/api/messages', (req, res) => {
  res.json({
    success: true,
    messages: [
      { id: 1, sender: 'Toko A', message: 'Stok vocer habis', date: '2024-01-18', read: false },
      { id: 2, sender: 'Budi', message: 'Tagihan sudah dibayar', date: '2024-01-19', read: true }
    ]
  });
});

// 7. Save Data (untuk semua tipe data)
app.post('/api/save/:type', (req, res) => {
  try {
    const { type } = req.params;
    const { data } = req.body;
    
    console.log(`💾 Saving ${type}:`, data);
    
    res.json({
      success: true,
      message: `Data ${type} berhasil disimpan`,
      savedCount: data.length,
      type: type
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error menyimpan data: ' + error.message
    });
  }
});

// 8. Health Check
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'Backend connected successfully',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// 9. Fallback untuk undefined routes
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint tidak ditemukan'
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: https://ceritesambas11.github.io/IndiegoNet-Management/`);
});
