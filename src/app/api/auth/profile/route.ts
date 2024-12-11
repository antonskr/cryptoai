import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectMongo from '@/lib/mongoose';
import User from '../../../models/User';

export async function GET(request: Request) {
  await connectMongo();
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(id);
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, user });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
  }
}
