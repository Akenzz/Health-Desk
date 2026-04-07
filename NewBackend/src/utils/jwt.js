const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

function issueToken(subject, roleClaim) {
  return jwt.sign({ role: roleClaim }, env.JWT_SECRET, {
    subject,
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

function decodeToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

function readTokenFromRequest(req) {
  const headerToken = req.headers.token;
  if (headerToken) return String(headerToken);

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length);
  }

  return null;
}

module.exports = {
  issueToken,
  decodeToken,
  readTokenFromRequest,
};
