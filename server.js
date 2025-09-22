// ==============================
// Variabel global
// ==============================
let currentUser = null;
const API_BASE_URL = "https://indiegonet-management.onrender.com";

// ==============================
// API Request Helper
// ==============================
async function apiRequest(endpoint, options = {}) {
    const headers = { "Content-Type": "application/json", ...options.headers };
    if (currentUser && currentUser.token) {
        headers["Authorization"] = `Bearer ${currentUser.token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers, ...options });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "API request failed");
        }
        return await response.json();
    } catch (err) {
        console.error("⚠️ API Error:", err);
        alert("⚠️ Gagal konek ke server: " + err.message);
        return null;
    }
}

// ==============================
// Auto-Check Section ID
// ==============================
const requiredSections = [
    "login-section",
    "admin-dashboard",
    "user-dashboard",
    "users-section",
    "customers-section",
    "deliveries-section",
    "messages-section",
    "billing-section"
];

window.addEventListener("DOMContentLoaded", () => {
    requiredSections.forEach(id => {
        if (!document.getElementById(id)) {
            console.warn(`⚠️ Section dengan id="${id}" belum ada di HTML`);
        }
    });
});

// ==============================
// Show/Hide Section
// ==============================
function showSection(id) {
    document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));

    const el = document.getElementById(id);
    if (el) {
        el.classList.remove("hidden");
    } else {
        console.warn("⚠️ Section dengan id:", id, "tidak ditemukan. Kembali ke login-section.");
        const loginEl = document.getElementById("login-section");
        if (loginEl) {
            loginEl.classList.remove("hidden");
        }
    }
}

// ==============================
// Update UI setelah login
// ==============================
function updateUI() {
    if (!currentUser) {
        showSection("login-section");
        return;
    }

    const userNameEl = document.getElementById("user-name");
    if (userNameEl) {
        userNameEl.textContent = currentUser.name || "User";
    }

    if (currentUser.role === "admin") {
        showSection("admin-dashboard");
    } else {
        showSection("user-dashboard");
    }
}

// ==============================
// Login
// ==============================
async function doLogin() {
    const u = document.getElementById("login-username").value;
    const p = document.getElementById("login-password").value;

    const result = await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: u, password: p })
    });

    if (result && result.success) {
        currentUser = result.user;
        updateUI();
    } else {
        alert("⚠️ Login gagal. " + (result ? result.message : ""));
    }
}

// ==============================
// Logout
// ==============================
function doLogout() {
    currentUser = null;
    updateUI();
}
