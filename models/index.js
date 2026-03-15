// models/index.js  — MongoDB Schemas
const mongoose = require('mongoose');

// ── Enquiry ─────────────────────────────────────────────────────────────────
const enquirySchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  phone:     { type: String, trim: true },
  company:   { type: String, trim: true },
  service:   { type: String, trim: true },
  message:   { type: String, required: true },
  status:    { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
  createdAt: { type: Date, default: Date.now }
});

// ── Registration ─────────────────────────────────────────────────────────────
const registrationSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, trim: true, lowercase: true, unique: true },
  phone:       { type: String, trim: true },
  company:     { type: String, trim: true },
  designation: { type: String, trim: true },
  interests:   [{ type: String }],
  newsletter:  { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

// ── Content (for Admin-managed homepage sections) ────────────────────────────
const contentSchema = new mongoose.Schema({
  section:   { type: String, required: true }, // e.g. 'hero', 'about', 'service', 'testimonial'
  title:     { type: String },
  subtitle:  { type: String },
  body:      { type: String },
  image:     { type: String },
  icon:      { type: String },
  order:     { type: Number, default: 0 },
  active:    { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Enquiry      = mongoose.model('Enquiry',      enquirySchema);
const Registration = mongoose.model('Registration', registrationSchema);
const Content      = mongoose.model('Content',      contentSchema);

module.exports = { Enquiry, Registration, Content };
