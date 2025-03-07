import { NextRequest, NextResponse } from 'next/server';
import { fetchAndStoreCreateMonsterEvents } from '@/app/lib/createMonsterEvent';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startBlock = searchParams.get('startBlock');
    const limit = searchParams.get('limit');

    const options: {
      startBlock?: number;
      limit?: number;
    } = {};

    if (startBlock) {
      options.startBlock = parseInt(startBlock, 10);
    }
    if (limit) {
      options.limit = parseInt(limit, 10);
    }

    const result = await fetchAndStoreCreateMonsterEvents(options);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch and store events' },
      { status: 500 }
    );
  }
} 