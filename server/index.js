// Force IPv4 DNS resolution — Railway doesn't support IPv6,
// so Supabase's hostname must resolve to an IPv4 address
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ─── ROUTES ───────────────────────────────────────────────────────────────────

const analyzeRoutes   = require('./routes/analyzeRoutes');
const authRoutes      = require('./routes/authRoutes');
const savedRoutes     = require('./routes/savedRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.get('/', (req, res) => res.json({ message: 'ComplexityLens API running!' }));

app.use('/api',           analyzeRoutes);
// POST /api/analyze, GET /api/history, GET /api/stats

app.use('/api/auth',      authRoutes);
// POST /api/auth/register, POST /api/auth/login, GET /api/auth/profile

app.use('/api/saved',     savedRoutes);
// POST /api/saved, GET /api/saved, DELETE /api/saved/:id

app.use('/api/dashboard', dashboardRoutes);
// GET /api/dashboard

// ─── START SERVER ─────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Routes: /api/analyze | /api/auth | /api/saved | /api/dashboard');
});
