// seed.js — Run once to populate initial content: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const { Content } = require('./models');

const defaultContent = [
  {
    section: 'announcement',
    icon: '🚀',
    title: 'Majestic Makers is Growing!',
    subtitle: 'New Offices in Hyderabad & Pune',
    body: 'We are thrilled to announce the expansion of our operations with two new offices. This growth reflects our commitment to serving clients across India with even greater depth and proximity.',
    order: 1,
    active: true,
  },
  {
    section: 'highlight',
    icon: '🏆',
    title: 'Ranked #1 Boutique Consultancy',
    subtitle: 'Business Today — 2024',
    body: 'We are honoured to be recognised as the #1 boutique management consultancy in India for the second consecutive year. Thank you to our clients, partners, and team for making this possible.',
    order: 2,
    active: true,
  },
  {
    section: 'event',
    icon: '📅',
    title: 'Strategy Summit 2024',
    subtitle: 'Mumbai | 15 November 2024',
    body: 'Join us for our annual flagship event bringing together India\'s top business leaders for a day of insights, networking, and transformative conversations. Limited seats available — register now.',
    order: 3,
    active: true,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/majestic_makers');
  await Content.deleteMany({});
  await Content.insertMany(defaultContent);
  console.log('✅ Seeded', defaultContent.length, 'content blocks.');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
