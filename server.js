const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log('Tidak bisa terhubung ke MongoDB:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Hello from IndiegoNet Backend!');
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});
