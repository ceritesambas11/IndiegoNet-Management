require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://indiegonet_db_user:<db_password>@cluster0.8jfzl5g.mongodb.net/indiegoDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Terhubung ke MongoDB'))
.catch(err => console.error('Kesalahan koneksi MongoDB:', err));

// Skema dan Model MongoDB
const customerSchema = new mongoose.Schema({
  nama: String,
  jenis: String,
  persen: Number,
  tagihanPribadi: Number
});

const deliverySchema = new mongoose.Schema({
  tgl: String,
  nama: String,
  v2: Number,
  v5: Number
});

const billingSchema = new mongoose.Schema({
  tglPenagihan: String,
  nama: String,
  jenis: String,
  v2Terjual: Number,
  v5Terjual: Number,
  totalTagihan: Number
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  name: String
});

const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  date: String,
  read: Boolean
});

const Customer = mongoose.model('Customer', customerSchema);
const Delivery = mongoose.model('Delivery', deliverySchema);
const Billing = mongoose.model('Billing', billingSchema);
const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

// Routes untuk Customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    // Hapus semua data lama dan simpan yang baru
    await Customer.deleteMany({});
    const newCustomers = await Customer.insertMany(req.body.data);
    res.status(201).json(newCustomers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes untuk Users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    await User.deleteMany({});
    const newUsers = await User.insertMany(req.body.data);
    res.status(201).json(newUsers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes untuk authentication
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: 'Username atau password salah' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes untuk Deliveries
app.get('/api/deliveries', async (req, res) => {
  try {
    const deliveries = await Delivery.find();
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/deliveries', async (req, res) => {
  try {
    await Delivery.deleteMany({});
    const newDeliveries = await Delivery.insertMany(req.body.data);
    res.status(201).json(newDeliveries);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes untuk Billings
app.get('/api/billings', async (req, res) => {
  try {
    const billings = await Billing.find();
    res.json(billings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/billings', async (req, res) => {
  try {
    await Billing.deleteMany({});
    const newBillings = await Billing.insertMany(req.body.data);
    res.status(201).json(newBillings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Routes untuk Messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    await Message.deleteMany({});
    const newMessages = await Message.insertMany(req.body.data);
    res.status(201).json(newMessages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});