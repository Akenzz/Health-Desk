import { NextResponse } from 'next/server';

const BASE_API_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:9112';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const audio = formData.get('audio');
    const meetingUuid = String(formData.get('meetingUuid') || '').trim();
    const phnumber = String(formData.get('phnumber') || '').trim();
    const doctorEmail = String(formData.get('doctor_email') || '').trim();
    const token = String(formData.get('token') || '').trim();

    if (!audio || !meetingUuid || !phnumber || !doctorEmail || !token) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const backendForm = new FormData();
    backendForm.append('audio', audio);
    backendForm.append('token', token);

    const uploadUrl = `${BASE_API_URL}/send/data/conversation?meetingUuid=${encodeURIComponent(meetingUuid)}&phnumber=${encodeURIComponent(phnumber)}&doctor_email=${encodeURIComponent(doctorEmail)}`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        token,
      },
      body: backendForm,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.valid) {
      return NextResponse.json(
        { success: false, message: 'Audio upload failed' },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('upload-audio route failed:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
