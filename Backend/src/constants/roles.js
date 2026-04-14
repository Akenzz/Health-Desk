const ROLE_CODES = {
  PATIENT: '01',
  DOCTOR: '02',
  PHARMACIST: '03',
};

// Keep claim values aligned with legacy Java behavior.
const ROLE_CLAIMS = {
  [ROLE_CODES.PATIENT]: 'Patient',
  [ROLE_CODES.DOCTOR]: 'Doctor',
  [ROLE_CODES.PHARMACIST]: 'Pharamcist',
};

module.exports = { ROLE_CODES, ROLE_CLAIMS };
