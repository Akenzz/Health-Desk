import { cookies } from 'next/headers';

function safeDecode(value) {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function auth() {
  const cookieStore = await cookies();

  return {
    token: cookieStore.get('token')?.value || null,
    userName: safeDecode(cookieStore.get('userName')?.value),
    email: safeDecode(cookieStore.get('email')?.value),
    phone: safeDecode(cookieStore.get('phone')?.value),
    role: safeDecode(cookieStore.get('role')?.value),
  };
  
}