const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const PatientDocument = require('../models/PatientDocument');
const { env } = require('../config/env');

const router = express.Router();

const BASE_DIR = path.join(os.homedir(), 'healthdesk', 'assets', 'documents');
fs.mkdirSync(BASE_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, BASE_DIR),
  filename: (_req, _file, cb) => cb(null, `${uuidv4()}.pdf`),
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const phone = String(req.body.phone || '').trim();
    if (!phone || !req.file) {
      return res.status(400).json({ message: 'phone and file are required' });
    }

    const uuid = path.basename(req.file.filename, path.extname(req.file.filename));

    const doc = await PatientDocument.create({
      patientPhoneNumber: phone,
      fileName: req.file.originalname,
      fileType: req.file.mimetype || 'application/pdf',
      fileUrl: `${env.CDN_DOCUMENT_BASE_URL}/${uuid}`,
      uuid,
      uploadedAt: new Date(),
    });

    return res.json(doc);
  } catch (error) {
    console.error('documents/upload failed:', error);
    return res.status(500).json({ message: 'Upload failed' });
  }
});

router.get('/:phone', async (req, res) => {
  try {
    const phone = String(req.params.phone || '').trim();
    const docs = await PatientDocument.find({ patientPhoneNumber: phone })
      .sort({ uploadedAt: -1 })
      .lean();

    return res.json(docs);
  } catch (error) {
    console.error('documents/:phone failed:', error);
    return res.status(500).json([]);
  }
});

module.exports = {
  documentsRouter: router,
  BASE_DIR,
};
