import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching events from database...'); // デバッグログを追加
    const events = await prisma.createMonsterEvent.findMany({
      orderBy: [
        { blockNumber: 'desc' },
        { timestamp: 'desc' }
      ],
      take: 1000, // 最新1000件を取得
    });
    console.log(`Found ${events.length} events`); // デバッグログを追加

    // BigIntを文字列に変換
    const serializedEvents = events.map(event => ({
      ...event,
      blockNumber: event.blockNumber.toString(),
    }));

    return NextResponse.json(serializedEvents);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
} 