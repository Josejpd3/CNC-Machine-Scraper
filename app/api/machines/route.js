import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('machines');
    const machines = await collection.find({}).toArray();
    return NextResponse.json(machines);
  } catch (error) {
    console.error('Error fetching machines:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

