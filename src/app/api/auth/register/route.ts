import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectMongo from '@/lib/mongoose';
import User from '../../../models/User';

export async function POST(request: Request) {
    await connectMongo();
    const { email, password } = await request.json();
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
  
    try {
      user.trialPeriod = new Date();
      await user.save();
      return NextResponse.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
      } else {
        return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 400 });
      }
    }
  }