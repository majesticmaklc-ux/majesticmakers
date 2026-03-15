// config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST   || 'smtp.gmail.com',
  port:   parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Send enquiry notification to company ─────────────────────────────────────
async function sendEnquiryNotification(enquiry) {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      process.env.COMPANY_EMAIL,
    subject: `🔔 New Enquiry from ${enquiry.name} — Majestic Makers`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0c88a;border-radius:8px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:30px;text-align:center">
          <h1 style="color:#e0c88a;margin:0;font-size:24px">✨ Majestic Makers</h1>
          <p style="color:#aaa;margin:5px 0 0">New Customer Enquiry</p>
        </div>
        <div style="padding:30px;background:#fff">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px;font-weight:bold;color:#555;width:140px">Name</td><td style="padding:10px;color:#222">${enquiry.name}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:10px;font-weight:bold;color:#555">Email</td><td style="padding:10px"><a href="mailto:${enquiry.email}">${enquiry.email}</a></td></tr>
            <tr><td style="padding:10px;font-weight:bold;color:#555">Phone</td><td style="padding:10px;color:#222">${enquiry.phone || '—'}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:10px;font-weight:bold;color:#555">Company</td><td style="padding:10px;color:#222">${enquiry.company || '—'}</td></tr>
            <tr><td style="padding:10px;font-weight:bold;color:#555">Service</td><td style="padding:10px;color:#222">${enquiry.service || '—'}</td></tr>
            <tr style="background:#f9f9f9"><td style="padding:10px;font-weight:bold;color:#555;vertical-align:top">Message</td><td style="padding:10px;color:#222">${enquiry.message}</td></tr>
          </table>
        </div>
        <div style="background:#f5f5f5;padding:15px;text-align:center;color:#999;font-size:12px">
          Received on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
        </div>
      </div>
    `,
  });
}

// ── Send auto-reply to customer ───────────────────────────────────────────────
async function sendAutoReply(enquiry) {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      enquiry.email,
    subject: `Thank you for contacting Majestic Makers, ${enquiry.name.split(' ')[0]}!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0c88a;border-radius:8px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px;text-align:center">
          <h1 style="color:#e0c88a;margin:0;font-size:28px;letter-spacing:2px">MAJESTIC MAKERS</h1>
          <p style="color:#aaa;margin:8px 0 0;font-size:14px">Excellence in Every Engagement</p>
        </div>
        <div style="padding:40px;background:#fff">
          <h2 style="color:#1a1a2e;margin-top:0">Dear ${enquiry.name},</h2>
          <p style="color:#555;line-height:1.8">Thank you for reaching out to us. We have received your enquiry and our team will get back to you within <strong>24 business hours</strong>.</p>
          <div style="background:#f9f6ee;border-left:4px solid #e0c88a;padding:20px;margin:20px 0;border-radius:0 8px 8px 0">
            <p style="margin:0;color:#555"><strong>Your message summary:</strong></p>
            <p style="margin:8px 0 0;color:#777;font-style:italic">"${enquiry.message.substring(0, 150)}${enquiry.message.length > 150 ? '...' : ''}"</p>
          </div>
          <p style="color:#555;line-height:1.8">In the meantime, feel free to explore our services or connect with us on social media.</p>
          <div style="text-align:center;margin:30px 0">
            <a href="mailto:${process.env.COMPANY_EMAIL}" style="background:linear-gradient(135deg,#e0c88a,#c9a84c);color:#1a1a2e;padding:12px 30px;border-radius:25px;text-decoration:none;font-weight:bold;display:inline-block">📧 Contact Us Directly</a>
          </div>
        </div>
        <div style="background:#1a1a2e;padding:20px;text-align:center;color:#666;font-size:12px">
          <p style="margin:0;color:#888">© ${new Date().getFullYear()} Majestic Makers. All rights reserved.</p>
          <p style="margin:5px 0 0;color:#666">${process.env.COMPANY_EMAIL}</p>
        </div>
      </div>
    `,
  });
}

// ── Registration confirmation ─────────────────────────────────────────────────
async function sendRegistrationConfirmation(reg) {
  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      reg.email,
    subject: `Welcome to Majestic Makers, ${reg.name.split(' ')[0]}! 🎉`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e0c88a;border-radius:8px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:40px;text-align:center">
          <div style="font-size:48px;margin-bottom:10px">🎉</div>
          <h1 style="color:#e0c88a;margin:0;font-size:28px;letter-spacing:2px">MAJESTIC MAKERS</h1>
          <p style="color:#aaa;margin:8px 0 0">You're now part of our network!</p>
        </div>
        <div style="padding:40px;background:#fff">
          <h2 style="color:#1a1a2e">Welcome aboard, ${reg.name}!</h2>
          <p style="color:#555;line-height:1.8">Your registration with Majestic Makers has been confirmed. We're thrilled to have you as part of our growing community of professionals.</p>
          <div style="background:#f9f6ee;padding:20px;border-radius:8px;margin:20px 0">
            <p style="margin:0;color:#555;font-weight:bold">Your Registration Details:</p>
            <p style="margin:5px 0;color:#777">📧 Email: ${reg.email}</p>
            ${reg.company ? `<p style="margin:5px 0;color:#777">🏢 Company: ${reg.company}</p>` : ''}
            ${reg.designation ? `<p style="margin:5px 0;color:#777">💼 Designation: ${reg.designation}</p>` : ''}
          </div>
          <p style="color:#555;line-height:1.8">Our team will be in touch with tailored insights and opportunities that align with your interests.</p>
        </div>
        <div style="background:#1a1a2e;padding:20px;text-align:center;color:#666;font-size:12px">
          <p style="margin:0;color:#888">© ${new Date().getFullYear()} Majestic Makers. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}

module.exports = { sendEnquiryNotification, sendAutoReply, sendRegistrationConfirmation };
