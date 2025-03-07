import { NextResponse } from 'next/server';
import { getCreateMonsterEventStats } from '@/app/lib/createMonsterEvent';

export async function GET() {
  try {
    const stats = await getCreateMonsterEventStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 