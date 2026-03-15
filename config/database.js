// config/database.js
require('dotenv').config();
const mongoose = require('mongoose');

// ── MongoDB Connection ──────────────────────────────────────────────────────
async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/majestic_makers', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// ── Elasticsearch Client (optional) ────────────────────────────────────────
let esClient = null;

async function connectElasticsearch() {
  try {
    const { Client } = require('@elastic/elasticsearch');
    esClient = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });
    await esClient.ping();
    console.log('✅ Elasticsearch connected successfully');

    // Create indices if they don't exist
    const indices = ['enquiries', 'registrations', 'content'];
    for (const index of indices) {
      const exists = await esClient.indices.exists({ index: `majestic_${index}` });
      if (!exists) {
        await esClient.indices.create({ index: `majestic_${index}` });
        console.log(`  📁 Created index: majestic_${index}`);
      }
    }
  } catch (err) {
    console.error('❌ Elasticsearch connection error:', err.message);
    process.exit(1);
  }
}

async function connect() {
  if (process.env.USE_ELASTICSEARCH === 'true') {
    await connectElasticsearch();
  } else {
    await connectMongoDB();
  }
}

function getESClient() { return esClient; }

module.exports = { connect, getESClient };
