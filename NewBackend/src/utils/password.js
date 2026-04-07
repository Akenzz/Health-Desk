const crypto = require('crypto');
const { env } = require('../config/env');

function hashPassword(password) {
  return crypto.createHash('sha256').update(`${password}${env.PASSWORD_SALT}`).digest('hex');
}

module.exports = { hashPassword };
