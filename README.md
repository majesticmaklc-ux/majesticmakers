# ✦ Majestic Makers — Consultancy Website

Full-stack consultancy website with:
- ✅ Beautiful luxury frontend (HTML + CSS + JS)
- ✅ Node.js + Express backend
- ✅ MongoDB (default) **OR** Elasticsearch storage
- ✅ Customer enquiry form → stores in DB + sends email
- ✅ Customer registration with interest tags + newsletter
- ✅ Admin CMS panel to manage homepage content blocks
- ✅ Auto-reply emails to customers (Nodemailer)
- ✅ Rate limiting, input validation, security headers

---

## 📁 Project Structure

```
majestic-makers/
├── server.js              ← Express entry point
├── seed.js                ← One-time DB seed script
├── .env.example           ← Copy to .env and fill in
├── package.json
├── config/
│   ├── database.js        ← MongoDB / Elasticsearch connector
│   └── email.js           ← Nodemailer email service
├── models/
│   └── index.js           ← Mongoose schemas (Enquiry, Registration, Content)
├── routes/
│   └── api.js             ← All API routes
└── public/
    ├── index.html         ← Main website
    ├── admin.html         ← Admin panel
    ├── css/style.css
    └── js/main.js
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd majestic-makers
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Start MongoDB (if not running)
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Docker
docker run -d -p 27017:27017 --name mongo mongo:7
```

### 4. (Optional) Seed default content
```bash
node seed.js
```

### 5. Start the server
```bash
npm start        # production
npm run dev      # development (auto-reload with nodemon)
```

### 6. Open in browser
- **Website:**    http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin.html

---

## 🗄️ Database Options

### Option A: MongoDB (Default — Recommended)
```env
MONGODB_URI=mongodb://localhost:27017/majestic_makers
USE_ELASTICSEARCH=false
```

### Option B: Elasticsearch
```bash
# Install Elasticsearch driver
npm install @elastic/elasticsearch

# Update .env
USE_ELASTICSEARCH=true
ELASTICSEARCH_URL=http://localhost:9200
```

> **Note:** MySQL support can be added by replacing Mongoose with Sequelize.
> The architecture is designed to make this swap straightforward.

---

## 📧 Email Configuration

The site sends two emails on every enquiry:
1. **Notification** to your company email
2. **Auto-reply** to the customer

### Gmail Setup
1. Enable 2FA on your Google Account
2. Go to: Google Account → Security → App Passwords
3. Generate a password for "Mail"
4. Use it as `EMAIL_PASS` in `.env`

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=yourname@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx   # 16-char app password
EMAIL_FROM=Majestic Makers <yourname@gmail.com>
COMPANY_EMAIL=contact@majesticmakers.com
```

---

## 🔐 Admin Panel

Access at `/admin.html`

**Default password:** set `ADMIN_PASSWORD` in `.env` (default: `Admin@Majestic2024`)

### Features:
| Feature | Description |
|---------|-------------|
| Dashboard | Stats overview + recent enquiries |
| Enquiries | View all, update status (new/read/replied) |
| Registrations | View all registered users |
| Content CMS | Add/edit/delete homepage content blocks |

---

## 🌐 API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/enquiry` | Submit customer enquiry |
| POST | `/api/register` | Register a new user |
| GET | `/api/content` | Get active content blocks |

### Admin (requires `x-admin-token` header)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/enquiries` | All enquiries |
| PATCH | `/api/admin/enquiries/:id` | Update enquiry status |
| GET | `/api/admin/registrations` | All registrations |
| POST | `/api/admin/content` | Create/update content block |
| DELETE | `/api/admin/content/:id` | Delete content block |

---

## 🔒 Security Features

- **Helmet.js** — HTTP security headers
- **Rate limiting** — 20 requests / 15 minutes on form endpoints
- **Input validation** — express-validator on all inputs
- **CORS** — configurable cross-origin policy

---

## 🎨 Customisation

### Change Colors
Edit CSS variables in `public/css/style.css`:
```css
:root {
  --navy: #0d1117;       /* background */
  --gold: #c9a84c;       /* accent */
  --gold-light: #e0c88a; /* headings */
}
```

### Add Services
Edit the services grid in `public/index.html`

### Company Info
Search for `majesticmakers.com`, phone numbers, and address in `public/index.html` and replace with your real details.

---

## 📦 Production Deployment

```bash
# Set environment
NODE_ENV=production

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name majestic-makers
pm2 save

# Or use Docker
docker build -t majestic-makers .
docker run -p 3000:3000 --env-file .env majestic-makers
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Backend | Node.js, Express 4 |
| Database | MongoDB (Mongoose) / Elasticsearch |
| Email | Nodemailer |
| Security | Helmet, express-rate-limit, express-validator |
| Fonts | Cormorant Garamond + Outfit (Google Fonts) |

---

*Built with ✦ for Majestic Makers Consultancy*
