// server.js — Majestic Makers Entry Point
require('dotenv').config();

const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const path       = require('path');
const { connect } = require('./config/database');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // CSP off for inline scripts
app.use(cors());

// ── Rate limiting (protect forms) ─────────────────────────────────────────────
const formLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/enquiry',  formLimiter);
app.use('/api/register', formLimiter);

// ── Parsing ───────────────────────────────────────────────────────────────────
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', require('./routes/api'));

// ── SPA fallback — serve index.html for all non-API routes ───────────────────
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
async function start() {
  await connect();
  app.listen(PORT, () => {
    console.log(`\n🚀 Majestic Makers running at http://localhost:${PORT}`);
    console.log(`📊 Admin panel:          http://localhost:${PORT}/admin.html`);
    console.log(`🗄️  Database:            ${process.env.USE_ELASTICSEARCH === 'true' ? 'Elasticsearch' : 'MongoDB'}`);
    console.log(`📧 Company email:        ${process.env.COMPANY_EMAIL || '(not set)'}\n`);
  });
}

start();
