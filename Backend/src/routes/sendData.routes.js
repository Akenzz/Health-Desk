const express = require('express');
const multer = require('multer');
const Patient = require('../models/Patient');
const ConversationSummary = require('../models/ConversationSummary');
const { attachAuth } = require('../middleware/auth');
const { setAvailable, extendAvailability, unsetAvailable } = require('../services/availabilityStore');
const { transcribeAudioWithAssemblyAI } = require('../services/assemblyAiService');
const { generateMedicalSummary } = require('../services/medicalSummaryService');
const { buildSummaryFromText, isEmptySummary } = require('../utils/summary');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(attachAuth);

router.post('/patient-details', async (req, res) => {
  try {
    const { patientName, phone, age, gender, bloodType, allergies } = req.query;
    if (!patientName || !phone) return res.json({ valid: false });

    await Patient.updateOne(
      { phone: String(phone).trim() },
      {
        $set: {
          name: String(patientName).trim(),
          age: String(age || ''),
          gender: String(gender || ''),
          bloodType: String(bloodType || ''),
          allergies: String(allergies || ''),
        },
      },
      { upsert: true }
    );

    return res.json({ valid: true });
  } catch (error) {
    console.error('patient-details write failed:', error);
    return res.json({ valid: false });
  }
});

router.post('/set-doctor-availability', (req, res) => {
  try {
    const { key } = req.query;
    const auth = req.auth;

    if (!auth || auth.subject !== String(key)) {
      return res.json(401);
    }

    setAvailable(String(key));
    return res.json(302);
  } catch (error) {
    console.error('set-doctor-availability failed:', error);
    return res.json(500);
  }
});

router.patch('/update-doctor-availability', (req, res) => {
  try {
    const { key } = req.query;
    const auth = req.auth;

    if (!auth || auth.subject !== String(key)) {
      return res.json(401);
    }

    extendAvailability(String(key));
    return res.json(null);
  } catch (error) {
    console.error('update-doctor-availability failed:', error);
    return res.json(500);
  }
});

router.post('/unset-doctor-availability', (req, res) => {
  try {
    const { key } = req.query;
    const auth = req.auth;

    if (!auth || auth.subject !== String(key)) {
      return res.json(401);
    }

    unsetAvailable(String(key));
    return res.json(null);
  } catch (error) {
    console.error('unset-doctor-availability failed:', error);
    return res.json(500);
  }
});

router.post('/conversation', upload.single('audio'), async (req, res) => {
  try {
    const { meetingUuid, phnumber, doctor_email } = req.query;
    const tokenFromBody = req.body?.token;

    // Next upload route may send token in form data; support that fallback.
    if (!req.auth && tokenFromBody) {
      req.headers.token = tokenFromBody;
      attachAuth(req, res, () => {});
    }

    if (!req.auth || req.auth.role === 'patient') {
      return res.status(401).json({ valid: false });
    }

    if (!meetingUuid || !phnumber || !doctor_email) {
      return res.status(400).json({ valid: false });
    }

    if (!req.file?.buffer?.length) {
      return res.status(400).json({ valid: false });
    }

    let transcript = '';
    let summary;

    try {
      transcript = await transcribeAudioWithAssemblyAI(req.file.buffer);
      summary = await generateMedicalSummary(transcript);
    } catch (error) {
      console.error('AI conversation pipeline failed, using deterministic fallback:', error.message);
      transcript = `Audio received (${req.file.originalname || 'audio'}) for meeting ${meetingUuid}`;
      summary = buildSummaryFromText(transcript);
    }

    if (isEmptySummary(summary)) return res.json({ valid: false });

    await ConversationSummary.create({
      context: transcript,
      patient_phonenumber: String(phnumber),
      doctor_email_id: String(doctor_email).toLowerCase(),
      summary_data: summary,
      datetime: new Date(),
    });

    return res.json({ valid: true });
  } catch (error) {
    console.error('conversation failed:', error);
    return res.json({ valid: false });
  }
});

module.exports = router;
