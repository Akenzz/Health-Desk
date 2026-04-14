const express = require('express');
const User = require('../models/User');
const Patient = require('../models/Patient');
const ConversationSummary = require('../models/ConversationSummary');
const DoctorProfile = require('../models/DoctorProfile');
const { attachAuth } = require('../middleware/auth');
const { isAvailable } = require('../services/availabilityStore');

const router = express.Router();
router.use(attachAuth);

router.get('/doctor-name', async (req, res) => {
  try {
    const { email } = req.query;
    const normalized = String(email || '').toLowerCase().trim();

    const profile = await DoctorProfile.findOne({ email: normalized }).lean();
    if (profile?.name) return res.json({ value: profile.name });

    const user = await User.findOne({ email: normalized }).lean();
    return res.json({ value: user?.name || '' });
  } catch (error) {
    console.error('doctor-name failed:', error);
    return res.status(500).json({ value: '' });
  }
});

router.get('/patient-phone', async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({
      email: String(email || '').toLowerCase().trim(),
      role: '01',
    }).lean();
    return res.json({ value: user?.phone || '' });
  } catch (error) {
    console.error('patient-phone failed:', error);
    return res.status(500).json({ value: '' });
  }
});

router.get('/patient-name', async (req, res) => {
  try {
    const { email } = req.query;
    const phone = String(email || '').trim();

    const patient = await Patient.findOne({ phone }).lean();
    if (patient?.name) return res.json({ value: patient.name });

    const user = await User.findOne({ phone }).lean();
    return res.json({ value: user?.name || '' });
  } catch (error) {
    console.error('patient-name failed:', error);
    return res.status(500).json({ value: '' });
  }
});

router.get('/get-doctor-availability', (req, res) => {
  try {
    const { key } = req.query;
    const available = isAvailable(String(key || ''));
    return res.json(available ? 302 : 404);
  } catch (error) {
    console.error('get-doctor-availability failed:', error);
    return res.json(500);
  }
});

router.get('/patient/conversation', async (req, res) => {
  try {
    const { patient_phnumber } = req.query;
    const auth = req.auth;

    if (!auth) return res.status(401).json({ message: 'Unauthorized' });
    if (auth.role === 'patient' && auth.subject !== String(patient_phnumber)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!(auth.role === 'patient' || auth.role === 'doctor')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const rows = await ConversationSummary.find({ patient_phonenumber: String(patient_phnumber) })
      .sort({ datetime: -1 })
      .lean();

    const symptomps = rows.map((r) => r.summary_data?.symptoms || []);
    const diagnosis = rows.map((r) => r.summary_data?.diagnosis || []);
    const prescription = rows.map((r) => r.summary_data?.prescription || []);
    const vitals = rows.map((r) => r.summary_data?.vitals || []);
    const lifestyle_advice = rows.map((r) => r.summary_data?.lifestyle_advice || []);
    const tests_recommended = rows.map((r) => r.summary_data?.tests_recommended || []);
    const follow_up_plan = rows.map((r) => r.summary_data?.follow_up_plan || []);
    const date = rows.map((r) => [new Date(r.datetime).toISOString()]);

    const patient = await Patient.findOne({ phone: String(patient_phnumber) }).lean();

    return res.json({
      id: String(patient?._id || ''),
      email: '',
      allergies: patient?.allergies ? [patient.allergies] : ['--'],
      symptomps,
      diagnosis,
      prescription,
      vitals,
      lifestyle_advice,
      tests_recommended,
      follow_up_plan,
      date,
    });
  } catch (error) {
    console.error('patient/conversation failed:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

router.get('/patient-list', async (req, res) => {
  try {
    const { doctor_emailid } = req.query;
    const auth = req.auth;

    if (!auth || auth.role !== 'doctor' || auth.subject !== String(doctor_emailid)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const rows = await ConversationSummary.find({ doctor_email_id: String(doctor_emailid) })
      .sort({ datetime: -1 })
      .lean();

    const byPatient = new Map();
    for (const row of rows) {
      if (!byPatient.has(row.patient_phonenumber)) {
        byPatient.set(row.patient_phonenumber, row);
      }
    }

    const patients = await Patient.find({
      phone: { $in: Array.from(byPatient.keys()) },
    }).lean();
    const nameByPhone = new Map(patients.map((p) => [p.phone, p.name]));

    const ordered = Array.from(byPatient.values()).sort(
      (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
    );

    const patient_name = ordered.map((r) => [nameByPhone.get(r.patient_phonenumber) || '']);
    const patient_phnumber = ordered.map((r) => [r.patient_phonenumber]);
    const diagnosis = ordered.map((r) => [r.summary_data?.diagnosis?.[0] || '']);
    const last_visit = ordered.map((r) => [new Date(r.datetime).toISOString()]);

    return res.json({ patient_name, patient_phnumber, diagnosis, last_visit });
  } catch (error) {
    console.error('patient-list failed:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

router.get('/patient-details', async (req, res) => {
  try {
    const { phonenumber } = req.query;
    const auth = req.auth;

    if (!auth) return res.status(401).json({ message: 'Unauthorized' });
    const isPatientSelf = auth.role === 'patient' && auth.subject === String(phonenumber);
    const isDoctor = auth.role === 'doctor';

    if (!(isPatientSelf || isDoctor)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const patient = await Patient.findOne({ phone: String(phonenumber) }).lean();
    if (!patient) {
      return res.status(404).json({
        name: '',
        age: '',
        gender: '',
        bloodType: '',
        allergies: '',
      });
    }

    return res.json({
      name: patient.name || '',
      age: patient.age || '',
      gender: patient.gender || '',
      bloodType: patient.bloodType || '',
      allergies: patient.allergies || '',
    });
  } catch (error) {
    console.error('patient-details failed:', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;
