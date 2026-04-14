const dotenv = require('dotenv');

dotenv.config();

const env = {
  PORT: Number(process.env.PORT || 9112),
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'Hisirjikaiseho',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '12h',
  PASSWORD_SALT: process.env.PASSWORD_SALT || '53KLGWV4CDV0bymo',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  GENAI_API_KEY: process.env.GENAI_API_KEY || '',
  GENAI_MODEL: process.env.GENAI_MODEL || 'gemini-2.0-flash',
  ASSEMBLYAI_API_KEY: process.env.ASSEMBLYAI_API_KEY || '',
  ASSEMBLYAI_BASE_URL: process.env.ASSEMBLYAI_BASE_URL || 'https://api.assemblyai.com/v2',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  CDN_DOCUMENT_BASE_URL:
    process.env.CDN_DOCUMENT_BASE_URL || 'http://localhost:9112/healthdesk/read/document',
};

module.exports = { env };
