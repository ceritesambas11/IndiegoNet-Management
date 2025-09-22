const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// ✅ CORS configuration
app.use(cors({
  origin: ["https://ceritesambas11.github.io", "http://localhost:3000"],
  credentials: true
}));

// ✅ Connect to MongoDB
const MONGODB_URI = "mongodb+srv://indiegonet_db_user:oQ4Jekt4Gh88qRRG@cluster0.8jfzl5g.mongodb.net/indiegoDB?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Define Mongoose Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

const customerSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  jenis: { type: String, enum: ['Toko', 'Pribadi'], required: true },
  persen: { type: Number, default: 0 },
  tagihanPribadi: { type: Number, default: 0 }
});

const deliverySchema = new mongoose.Schema({
  tgl: { type: Date, required: true },
  nama: { type: String, required: true },
  v2: { type: Number, default: 0 },
  v5: { type: Number, default: 0 }
});

const billingSchema = new mongoose.Schema({
  tglPenagihan: { type: Date, required: true },
  nama: { type: String, required: true },
  jenis: { type: String, enum: ['Toko', 'Pribadi'], required: true },
  // Fields for Toko
  dari: Date,
  sampai: Date,
  terkirimV2: Number,
  terkirimV5: Number,
  sisaV2: Number,
  sisaV5: Number,
  v2Terjual: Number,
  v5Terjual: Number,
  totalPenjualan: Number,
  bagianToko: Number,
  totalTagihan: Number,
  // Fields for Pribadi
  tagihanPribadi: Number
});

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

// ✅ Create Models
const User = mongoose.model('User', userSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Delivery = mongoose.model('Delivery', deliverySchema);
const Billing = mongoose.model('Billing', billingSchema);
const Message = mongoose.model('Message', messageSchema);

// ✅ Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// =========================
// Auth Endpoints
// =========================
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // For now, we're comparing plain text passwords
    // In production, you should use bcrypt.compare
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// =========================
// Data Endpoints
// =========================
app.get("/api/customers", authenticateToken, async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/api/customers", authenticateToken, async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.json({ success: true, data: newCustomer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Implement similar endpoints for other models (users, deliveries, billings, messages)

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
