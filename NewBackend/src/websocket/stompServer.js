const { WebSocketServer } = require('ws');
const { decodeToken } = require('../utils/jwt');

const WS_PATH = '/healthdesk-ws';
const DOCTOR_QUEUE = '/user/queue/healthdesk/read/videocall-details';
const PATIENT_CREATE_DESTINATION = '/app/healthdesk/videocall/create';

let messageCounter = 0;

function normalizeRole(roleValue) {
  const role = String(roleValue || '').toLowerCase();
  if (role === 'patient') return 'patient';
  if (role === 'doctor') return 'doctor';
  if (role === 'pharamcist' || role === 'pharmacist') return 'pharmacist';
  return 'unknown';
}

function parseFrame(frameText) {
  const normalized = frameText.replace(/\r/g, '');
  const separatorIndex = normalized.indexOf('\n\n');
  const head = separatorIndex >= 0 ? normalized.slice(0, separatorIndex) : normalized;
  const body = separatorIndex >= 0 ? normalized.slice(separatorIndex + 2) : '';

  const lines = head.split('\n').filter((line) => line.length > 0);
  const command = lines.shift() || '';
  const headers = {};

  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx <= 0) continue;
    const key = line.slice(0, idx);
    const value = line.slice(idx + 1);
    headers[key] = value;
  }

  return { command, headers, body };
}

function serializeFrame(command, headers = {}, body = '') {
  const headerLines = Object.entries(headers).map(([key, value]) => `${key}:${value}`);
  return `${command}\n${headerLines.join('\n')}\n\n${body}\u0000`;
}

function sendFrame(socket, command, headers = {}, body = '') {
  if (socket.readyState !== 1) return;
  socket.send(serializeFrame(command, headers, body));
}

function sendErrorAndClose(socket, message) {
  sendFrame(socket, 'ERROR', { message }, message);
  socket.close();
}

function buildPrincipalFromToken(token) {
  const payload = decodeToken(token);
  return {
    token,
    subject: payload.sub,
    roleClaim: payload.role,
    role: normalizeRole(payload.role),
  };
}

function routeCreateVideoCall({ sourceSocket, body, clients }) {
  let payload;

  try {
    payload = JSON.parse(body || '{}');
  } catch (_error) {
    return;
  }

  const doctorEmail = String(payload.doctorEmail || '').toLowerCase().trim();
  const meetingUuid = String(payload.meetingUuid || '').trim();

  if (!doctorEmail || !meetingUuid) return;

  const patientNumber = String(sourceSocket.principal?.subject || '').trim();
  if (!patientNumber) return;

  const notificationBody = JSON.stringify({
    meeting_uuid: meetingUuid,
    patient_phonenumber: patientNumber,
  });

  for (const socket of clients) {
    if (socket.readyState !== 1) continue;
    if (!socket.principal) continue;
    if (socket.principal.role !== 'doctor') continue;
    if (String(socket.principal.subject || '').toLowerCase().trim() !== doctorEmail) continue;

    for (const subscription of socket.subscriptions.values()) {
      if (subscription.destination !== DOCTOR_QUEUE) continue;

      messageCounter += 1;
      sendFrame(
        socket,
        'MESSAGE',
        {
          subscription: subscription.id,
          destination: DOCTOR_QUEUE,
          'message-id': `msg-${messageCounter}`,
          'content-type': 'application/json',
        },
        notificationBody
      );
    }
  }
}

function handleStompFrame({ socket, frame, clients }) {
  const { command, headers, body } = frame;

  if (command === 'CONNECT' || command === 'STOMP') {
    const token = String(headers.token || '').trim();
    if (!token) {
      sendErrorAndClose(socket, 'Missing token header');
      return;
    }

    try {
      socket.principal = buildPrincipalFromToken(token);
      sendFrame(socket, 'CONNECTED', {
        version: '1.2',
        'heart-beat': '0,0',
        server: 'healthdesk-node-stomp',
      });
    } catch (_error) {
      sendErrorAndClose(socket, 'Invalid token');
    }
    return;
  }

  if (!socket.principal) {
    sendErrorAndClose(socket, 'Not connected');
    return;
  }

  if (command === 'SUBSCRIBE') {
    const destination = String(headers.destination || '').trim();
    const id = String(headers.id || `sub-${Date.now()}`);

    socket.subscriptions.set(id, { id, destination });
    return;
  }

  if (command === 'UNSUBSCRIBE') {
    const id = String(headers.id || '').trim();
    if (id) socket.subscriptions.delete(id);
    return;
  }

  if (command === 'SEND') {
    const destination = String(headers.destination || '').trim();
    if (destination === PATIENT_CREATE_DESTINATION && socket.principal.role === 'patient') {
      routeCreateVideoCall({ sourceSocket: socket, body, clients });
    }
    return;
  }

  if (command === 'DISCONNECT') {
    socket.close();
  }
}

function initStompServer(httpServer) {
  const wss = new WebSocketServer({ server: httpServer, path: WS_PATH });
  const clients = new Set();

  wss.on('connection', (socket) => {
    socket.principal = null;
    socket.subscriptions = new Map();
    socket.frameBuffer = '';
    clients.add(socket);

    socket.on('message', (rawData) => {
      const chunk = rawData.toString('utf8');
      if (chunk === '\n') return;

      socket.frameBuffer += chunk;
      const frames = socket.frameBuffer.split('\u0000');
      socket.frameBuffer = frames.pop() || '';

      for (const rawFrame of frames) {
        const trimmed = rawFrame.trim();
        if (!trimmed) continue;
        const frame = parseFrame(trimmed);
        handleStompFrame({ socket, frame, clients });
      }
    });

    socket.on('close', () => {
      clients.delete(socket);
    });

    socket.on('error', () => {
      clients.delete(socket);
    });
  });

  return wss;
}

module.exports = {
  initStompServer,
};
