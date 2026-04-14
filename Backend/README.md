# NewBackend

Express.js + MongoDB backend that mirrors the currently used Health-Desk frontend flows for:
- consultation
- dashboard (session-driven auth compatibility)
- profile (logout/session compatibility through existing Next API)
- records
- signup/login OTP auth (via Resend)

## Quick Start

1. Install dependencies:
   npm install

2. Create env file:
   cp .env.example .env

3. Update `.env` values (especially `MONGO_URI`, `JWT_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`).

4. Run dev server:
   npm run dev

Server default: `http://localhost:9112`

## Implemented API Surface

Auth:
- `GET /healthdesk/auth/check/email`
- `GET /healthdesk/auth/send/email`
- `GET /healthdesk/auth/check/otp/email`
- `POST /healthdesk/auth/create/patient`
- `GET /healthdesk/auth/check/password`

Read data:
- `GET /healthdesk/read/data/doctor-name`
- `GET /healthdesk/read/data/patient-phone`
- `GET /healthdesk/read/data/patient-name`
- `GET /healthdesk/read/data/get-doctor-availability`
- `GET /healthdesk/read/data/patient/conversation`
- `GET /healthdesk/read/data/patient-list`
- `GET /healthdesk/read/data/patient-details`

Send data:
- `POST /healthdesk/send/data/patient-details`
- `POST /healthdesk/send/data/set-doctor-availability`
- `PATCH /healthdesk/send/data/update-doctor-availability`
- `POST /healthdesk/send/data/unset-doctor-availability`
- `POST /healthdesk/send/data/conversation`

Documents:
- `POST /healthdesk/documents/upload`
- `GET /healthdesk/documents/:phone`
- `GET /healthdesk/read/document/:uuid`

## Notes

- OTP sending uses Resend. If `RESEND_API_KEY` is missing, OTP is still stored and logged for local development.
- This backend intentionally mirrors response key names used by the current frontend (including legacy key names like `symptomps`).
- WebSocket/STOMP signaling endpoint is not included in this first cut and should be finalized based on your deployment protocol choice.
