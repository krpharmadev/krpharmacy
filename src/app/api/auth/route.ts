import { NextResponse } from 'next/server';
import { createUser } from '@/services/user.service';

export async function POST(request: Request) {
  const body = await request.json();
  const user = await createUser(body.name, body.email, body.line_user_id, body.user_type);
  return NextResponse.json(user);
}
