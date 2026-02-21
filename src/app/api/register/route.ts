import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { RegisterPayload, RegisterResponse } from '@/types/auth';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RegisterPayload;
    
    console.log('Registro recibido', { email: body.email });

    const result: RegisterResponse = { ok: true, message: 'Usuario creado (mock)' };
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ ok: false, message: 'Invalid payload' }, { status: 400 });
  }
}
