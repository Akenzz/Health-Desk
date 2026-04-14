#!/usr/bin/env bash
set -u

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PIDS=()

cleanup() {
  echo
  echo "Stopping all services..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
  wait 2>/dev/null || true
}

trap cleanup INT TERM EXIT

start_ai() {
  cd "$ROOT_DIR/AI" || exit 1
  if [[ -x ".venv/bin/python" ]]; then
    .venv/bin/python app.py
  else
    python3 app.py
  fi
}

start_backend() {
  cd "$ROOT_DIR/Backend" || exit 1
  npm run start
}

start_frontend() {
  cd "$ROOT_DIR/Frontend" || exit 1
  npm run dev
}

start_ai &
ai_pid="$!"
PIDS+=("$ai_pid")

echo "AI started (pid: $ai_pid)"

start_backend &
backend_pid="$!"
PIDS+=("$backend_pid")

echo "Backend started (pid: $backend_pid)"

start_frontend &
frontend_pid="$!"
PIDS+=("$frontend_pid")

echo "Frontend started (pid: $frontend_pid)"

if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:3000" >/dev/null 2>&1 || true
elif command -v open >/dev/null 2>&1; then
  open "http://localhost:3000" >/dev/null 2>&1 || true
fi

echo "All services launched. Press Ctrl+C to stop all."

wait
