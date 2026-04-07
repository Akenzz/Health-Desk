const availability = new Map();
const SIXTY_MIN_MS = 60 * 60 * 1000;

function setAvailable(key) {
  availability.set(key, Date.now() + SIXTY_MIN_MS);
}

function extendAvailability(key) {
  if (!availability.has(key)) return false;
  availability.set(key, Date.now() + SIXTY_MIN_MS);
  return true;
}

function unsetAvailable(key) {
  availability.delete(key);
}

function isAvailable(key) {
  const expiresAt = availability.get(key);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    availability.delete(key);
    return false;
  }
  return true;
}

module.exports = {
  setAvailable,
  extendAvailability,
  unsetAvailable,
  isAvailable,
};
