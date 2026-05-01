const express = require('express');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Otp = require('../models/Otp');
const { issueToken } = require('../utils/jwt');
const { ROLE_CODES, ROLE_CLAIMS } = require('../constants/roles');
const { sendOtpEmail } = require('../services/otpEmailService');

const router = express.Router();

router.get('/version', (_req, res) => {
  res.send('0.1');
});

router.get('/check/password', async (req, res) => {
  try {
    const { email, password, role } = req.query;
    if (!email || !password || !role) {
      return res.json({ token: '', valid: false });
    }

    const user = await User.findOne({
      email: String(email).toLowerCase(),
      role: String(role),
    }).lean();

    if (!user || user.password !== String(password)) {
      return res.json({ token: '', valid: false });
    }

    const subject = user.role === ROLE_CODES.PATIENT ? user.phone : user.email;
    const roleClaim = ROLE_CLAIMS[user.role] || ROLE_CLAIMS[ROLE_CODES.PATIENT];
    const token = issueToken(subject, roleClaim);

    return res.json({ token, valid: true });
  } catch (error) {
    console.error('check/password failed:', error);
    return res.json({ token: '', valid: false });
  }
});

router.post('/create/patient', async (req, res) => {
  try {
    const { name, phone, email, password, role = ROLE_CODES.PATIENT } = req.query;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ valid: false });
    }

    const roleCode = String(role || ROLE_CODES.PATIENT);
    const payload = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: String(email).toLowerCase().trim(),
      // Frontend already sends a salted SHA-256 password hash.
      // Keep parity with legacy Java backend by storing it as-is.
      password: String(password),
      role: roleCode,
    };

    const existing = await User.findOne({
      $or: [{ email: payload.email, role: payload.role }, { phone: payload.phone }],
    }).lean();

    if (existing) {
      return res.status(409).json({ valid: false });
    }

    await User.create(payload);

    // Keep patient collection in sync when creating patient user directly.
    if (roleCode === ROLE_CODES.PATIENT) {
      await Patient.updateOne(
        { phone: payload.phone },
        {
          $setOnInsert: {
            name: payload.name,
            age: '',
            gender: '',
            bloodType: '',
            allergies: '',
          },
        },
        { upsert: true }
      );
    }

    return res.json({ valid: true });
  } catch (error) {
    console.error('create/patient failed:', error);
    return res.status(500).json({ valid: false });
  }
});

router.get('/check/phone', async (req, res) => {
  try {
    const { phonenumber } = req.query;
    if (!phonenumber) return res.json({ valid: false });

    const exists = await User.exists({ phone: String(phonenumber).trim() });
    return res.json({ valid: Boolean(exists) });
  } catch (error) {
    console.error('check/phone failed:', error);
    return res.json({ valid: false });
  }
});

router.get('/check/email', async (req, res) => {
  try {
    const { email, role = ROLE_CODES.PATIENT } = req.query;
    if (!email) return res.json({ valid: false });

    const exists = await User.exists({
      email: String(email).toLowerCase().trim(),
      role: String(role),
    });
    return res.json({ valid: Boolean(exists) });
  } catch (error) {
    console.error('check/email failed:', error);
    return res.json({ valid: false });
  }
});

router.get('/send/email', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ valid: false });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { username: String(email).toLowerCase().trim() },
      { otp, expiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const sent = await sendOtpEmail(String(email).toLowerCase().trim(), otp);
    return res.json({
      valid: Boolean(sent.ok),
      message: sent.ok ? 'OTP sent successfully' : (sent.error?.message || 'Failed to send OTP'),
    });
  } catch (error) {
    console.error('send/email failed:', error);
    return res.status(500).json({ valid: false });
  }
});

router.get('/check/otp/email', async (req, res) => {
  try {
    const { email, otp } = req.query;
    if (!email || !otp) return res.json({ valid: false });

    const record = await Otp.findOne({ username: String(email).toLowerCase().trim() }).lean();
    if (!record) return res.json({ valid: false });

    const isValid = record.otp === String(otp) && new Date(record.expiresAt).getTime() > Date.now();
    return res.json({ valid: isValid });
  } catch (error) {
    console.error('check/otp/email failed:', error);
    return res.json({ valid: false });
  }
});

module.exports = router;
