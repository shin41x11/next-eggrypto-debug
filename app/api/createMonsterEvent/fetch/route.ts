import { NextResponse } from 'next/server';
import { fetchAndStoreCreateMonsterEvents } from '@/app/lib/createMonsterEvent';

export async function GET() {
  try {
    const result = await fetchAndStoreCreateMonsterEvents();
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and store events' },
      { status: 500 }
    );
  }
} 