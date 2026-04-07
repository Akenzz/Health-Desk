const { app } = require('./src/app');
const { connectDB } = require('./src/config/db');
const { env } = require('./src/config/env');
const http = require('http');
const { initStompServer } = require('./src/websocket/stompServer');

async function start() {
  await connectDB(env.MONGO_URI);
  const server = http.createServer(app);
  initStompServer(server);

  server.listen(env.PORT, () => {
    console.log(`NewBackend listening on http://localhost:${env.PORT}`);
    console.log(`STOMP WebSocket listening on ws://localhost:${env.PORT}/healthdesk-ws`);
  });
}

start().catch((error) => {
  console.error('Failed to start NewBackend:', error);
  process.exit(1);
});
