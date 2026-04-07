const normalizeBase = (value, fallback = '') => {
  const resolved = (value || fallback || '').trim();
  return resolved.endsWith('/') ? resolved.slice(0, -1) : resolved;
};

export const BACKEND_BASE_URL = normalizeBase(
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
  'http://localhost:9112'
);

export const AI_BASE_URL = normalizeBase(
  process.env.NEXT_PUBLIC_AI_BASE_URL,
  'http://localhost:8000'
);

export const WEBSOCKET_URL = (process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:9112/healthdesk-ws').trim();
export const CDN_VIDEO_BASE_URL = normalizeBase(process.env.NEXT_PUBLIC_CDN_VIDEO_BASE_URL, 'http://localhost:9112/healthdesk/read/video');
export const JITSI_DOMAIN = (process.env.NEXT_PUBLIC_JITSI_DOMAIN || 'meet.jit.si').trim();
export const JITSI_EXTERNAL_API_URL = (process.env.NEXT_PUBLIC_JITSI_EXTERNAL_API_URL || 'https://meet.jit.si/external_api.js').trim();

export const backendUrl = (path) => `${BACKEND_BASE_URL}${path}`;
export const aiUrl = (path) => `${AI_BASE_URL}${path}`;
export const cdnVideoUrl = (uuid) => `${CDN_VIDEO_BASE_URL}/${uuid}`;