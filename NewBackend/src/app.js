const express = require('express');
const cors = require('cors');
const path = require('path');
const { env } = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const readDataRoutes = require('./routes/readData.routes');
const sendDataRoutes = require('./routes/sendData.routes');
const { documentsRouter, BASE_DIR } = require('./routes/documents.routes');

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'NewBackend' });
});

// Primary mounts (for current production-style base URL ending with /healthdesk)
app.use('/healthdesk/auth', authRoutes);
app.use('/healthdesk/read/data', readDataRoutes);
app.use('/healthdesk/send/data', sendDataRoutes);
app.use('/healthdesk/documents', documentsRouter);

// Compatibility mounts for local setups where base URL is host only.
app.use('/auth', authRoutes);
app.use('/read/data', readDataRoutes);
app.use('/send/data', sendDataRoutes);
app.use('/documents', documentsRouter);

// Serve uploaded records by UUID.
app.get('/healthdesk/read/document/:uuid', (req, res) => {
  const absolute = path.join(BASE_DIR, `${req.params.uuid}.pdf`);
  res.sendFile(absolute, (err) => {
    if (err) res.status(404).json({ message: 'Document not found' });
  });
});

app.get('/read/document/:uuid', (req, res) => {
  const absolute = path.join(BASE_DIR, `${req.params.uuid}.pdf`);
  res.sendFile(absolute, (err) => {
    if (err) res.status(404).json({ message: 'Document not found' });
  });
});

module.exports = { app };
