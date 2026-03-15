// routes/api.js
const express  = require('express');
const router   = express.Router();
const { body, validationResult } = require('express-validator');
const { Enquiry, Registration, Content } = require('../models');
const { sendEnquiryNotification, sendAutoReply, sendRegistrationConfirmation } = require('../config/email');

// ══════════════════════════════════════════════════════════════════
//  ENQUIRY
// ══════════════════════════════════════════════════════════════════
router.post('/enquiry', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const enquiry = new Enquiry(req.body);
    await enquiry.save();

    // Send emails (fire-and-forget — don't block response)
    Promise.allSettled([
      sendEnquiryNotification(enquiry),
      sendAutoReply(enquiry),
    ]).then(results => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') console.warn(`Email ${i} failed:`, r.reason?.message);
      });
    });

    res.json({ success: true, message: 'Enquiry submitted successfully! We will get back to you shortly.' });
  } catch (err) {
    console.error('Enquiry error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ══════════════════════════════════════════════════════════════════
//  REGISTRATION
// ══════════════════════════════════════════════════════════════════
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const existing = await Registration.findOne({ email: req.body.email });
    if (existing) return res.status(409).json({ success: false, message: 'This email is already registered.' });

    const registration = new Registration(req.body);
    await registration.save();

    // Confirmation email
    sendRegistrationConfirmation(registration).catch(e => console.warn('Reg email failed:', e.message));

    res.json({ success: true, message: `Welcome, ${req.body.name}! Your registration is confirmed.` });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000) return res.status(409).json({ success: false, message: 'Email already registered.' });
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ══════════════════════════════════════════════════════════════════
//  CONTENT  (public read)
// ══════════════════════════════════════════════════════════════════
router.get('/content', async (req, res) => {
  try {
    const { section } = req.query;
    const query = { active: true };
    if (section) query.section = section;
    const content = await Content.find(query).sort({ section: 1, order: 1 });
    res.json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not load content.' });
  }
});

// ══════════════════════════════════════════════════════════════════
//  ADMIN — simple token-based guard
// ══════════════════════════════════════════════════════════════════
function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Unauthorised' });
  }
  next();
}

// Admin: get all enquiries
router.get('/admin/enquiries', adminAuth, async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, data: enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: get all registrations
router.get('/admin/registrations', adminAuth, async (req, res) => {
  try {
    const regs = await Registration.find().sort({ createdAt: -1 });
    res.json({ success: true, data: regs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: create / update content
router.post('/admin/content', adminAuth, async (req, res) => {
  try {
    const { _id, ...data } = req.body;
    let content;
    if (_id) {
      data.updatedAt = new Date();
      content = await Content.findByIdAndUpdate(_id, data, { new: true });
    } else {
      content = await Content.create(data);
    }
    res.json({ success: true, data: content });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: delete content
router.delete('/admin/content/:id', adminAuth, async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin: mark enquiry read
router.patch('/admin/enquiries/:id', adminAuth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
