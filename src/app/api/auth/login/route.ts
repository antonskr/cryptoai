// route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectMongo from '@/lib/mongoose';
import User from '../../../models/User';

export async function POST(request: Request) {
  await connectMongo();
  const { email, password } = await request.json();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'User not found' },
      { status: 404 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    );
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  });
  return NextResponse.json({ success: true, token });
}