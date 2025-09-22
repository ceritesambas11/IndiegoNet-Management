const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// ✅ CORS biar bisa diakses dari GitHub Pages
app.use(
  cors({
    origin: "https://ceritesambas11.github.io", // ganti sesuai domain frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// =========================
// Dummy Database (in-memory)
// =========================
let users = [
  { id: 1, username: "admin", password: "admin123", name: "Admin", role: "admin" },
  { id: 2, username: "user", password: "user123", name: "User Biasa", role: "user" },
];
let customers = [];
let deliveries = [];
let messages = [];

// =========================
// Auth
// =========================
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;
  console.log("🔐 Login attempt:", username);

  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: "Username atau password salah" });
  }

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      token: "dummy-token-" + user.id,
    },
  });
});

// =========================
// Users CRUD
// =========================
app.get("/api/users", (req, res) => {
  res.json({ success: true, data: users });
});

app.post("/api/users", (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  res.json({ success: true, data: newUser });
});

app.put("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  users = users.map((u) => (u.id === id ? { ...u, ...req.body } : u));
  res.json({ success: true });
});

app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter((u) => u.id !== id);
  res.json({ success: true });
});

app.get("/api/users/:id/dashboard", (req, res) => {
  res.json({
    success: true,
    data: {
      v2_total: 100,
      v5_total: 50,
      v2_sold: 40,
      v5_sold: 30,
      deliveries,
      customer_type: "Pribadi",
      pribadi_tagihan: 150000,
      messages,
    },
  });
});

// =========================
// Customers CRUD
// =========================
app.get("/api/customers", (req, res) => {
  res.json({ success: true, data: customers });
});

app.post("/api/customers", (req, res) => {
  const newCustomer = { id: Date.now(), ...req.body };
  customers.push(newCustomer);
  res.json({ success: true, data: newCustomer });
});

app.put("/api/customers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  customers = customers.map((c) => (c.id === id ? { ...c, ...req.body } : c));
  res.json({ success: true });
});

app.delete("/api/customers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  customers = customers.filter((c) => c.id !== id);
  res.json({ success: true });
});

// =========================
// Deliveries CRUD
// =========================
app.get("/api/deliveries", (req, res) => {
  res.json({ success: true, data: deliveries });
});

app.post("/api/deliveries", (req, res) => {
  const newDelivery = { id: Date.now(), ...req.body };
  deliveries.push(newDelivery);
  res.json({ success: true, data: newDelivery });
});

app.delete("/api/deliveries/:id", (req, res) => {
  const id = parseInt(req.params.id);
  deliveries = deliveries.filter((d) => d.id !== id);
  res.json({ success: true });
});

app.post("/api/deliveries/clear", (req, res) => {
  deliveries = [];
  res.json({ success: true });
});

app.get("/api/deliveries/summary", (req, res) => {
  res.json({
    success: true,
    data: { v2_total: 10, v5_total: 5 },
  });
});

// =========================
// Messages
// =========================
app.post("/api/messages", (req, res) => {
  const newMsg = { id: Date.now(), sender_name: "Anonim", date: new Date(), message_text: req.body.message };
  messages.push(newMsg);
  res.json({ success: true, data: newMsg });
});

app.get("/api/messages", (req, res) => {
  res.json({ success: true, data: messages });
});

app.delete("/api/messages/:id", (req, res) => {
  const id = parseInt(req.params.id);
  messages = messages.filter((m) => m.id !== id);
  res.json({ success: true });
});

// =========================
// Admin Dashboard
// =========================
app.get("/api/admin/dashboard", (req, res) => {
  res.json({
    success: true,
    data: {
      total_sales: 500000,
      total_customers: customers.length,
      total_messages: messages.length,
      top_customer: customers.length ? customers[0].name : "-",
      sales_trend: 1,
      sales_trend_text: "Naik",
      customer_performance: customers.map((c) => ({
        name: c.name,
        current_month: 10,
        last_month: 8,
        trend_text: "Naik",
        trend_class: "trend-up",
      })),
      messages,
    },
  });
});

// =========================
// Banner
// =========================
app.post("/api/banner", (req, res) => {
  console.log("📢 Banner update:", req.body.url);
  res.json({ success: true });
});

// =========================
// Start Server
// =========================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
  console.log(`📡 API Base URL: https://indiegonet-management.onrender.com`);
});
