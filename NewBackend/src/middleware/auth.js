const { decodeToken, readTokenFromRequest } = require('../utils/jwt');

function normalizeRole(roleValue) {
  const role = String(roleValue || '').toLowerCase();
  if (role === 'patient') return 'patient';
  if (role === 'doctor') return 'doctor';
  if (role === 'pharamcist' || role === 'pharmacist') return 'pharmacist';
  return 'unknown';
}

function attachAuth(req, _res, next) {
  const token = readTokenFromRequest(req);
  if (!token) {
    req.auth = null;
    return next();
  }

  try {
    const payload = decodeToken(token);
    req.auth = {
      token,
      subject: payload.sub,
      roleClaim: payload.role,
      role: normalizeRole(payload.role),
      exp: payload.exp,
    };
  } catch (_error) {
    req.auth = null;
  }

  next();
}

module.exports = { attachAuth };
