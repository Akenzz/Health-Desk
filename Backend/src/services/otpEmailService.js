const { Resend } = require('resend');
const { env } = require('../config/env');

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

async function sendOtpEmail(email, otp) {
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Helvetica, Arial, sans-serif; background:#f4f4f4; padding:20px;">
        <div style="max-width:600px; margin:auto; background:#fff; border-radius:8px; padding:24px;">
          <h2 style="margin:0 0 12px; color:#1f2937;">OTP Verification</h2>
          <p style="color:#4b5563;">Use the OTP below to continue:</p>
          <div style="font-size:28px; font-weight:700; letter-spacing:4px; color:#0ea5e9;">${otp}</div>
        </div>
      </body>
    </html>
  `;

  if (!resend) {
    console.warn('RESEND_API_KEY is missing; OTP email was not sent.');
    return { ok: false, error: new Error('Email service is not configured') };
  }

  try {
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: email,
      subject: 'OTP',
      html,
    });
    return { ok: true };
  } catch (error) {
    console.error('Resend send failed:', error);
    return { ok: false, error };
  }
}

module.exports = { sendOtpEmail };
