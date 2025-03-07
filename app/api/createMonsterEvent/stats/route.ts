import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    // 総レコード数を取得
    const totalCount = await prisma.createMonsterEvent.count();
    
    // 最新のイベントを取得（全ての必要なフィールドを含む）
    const latestEvent = await prisma.createMonsterEvent.findFirst({
      orderBy: [
        { blockNumber: 'desc' },
        { timestamp: 'desc' }
      ],
      select: {
        blockNumber: true,
        timestamp: true,
        createdAt: true,
      },
    });

    console.log('Latest event:', latestEvent); // デバッグ用

    // データを整形
    const stats = {
      totalCount,
      latestBlockNumber: latestEvent ? latestEvent.blockNumber.toString() : null,
      latestTimestamp: latestEvent?.timestamp?.toISOString() || null,
      latestCreatedAt: latestEvent?.createdAt?.toISOString() || null,
    };

    console.log('Stats response:', stats); // デバッグ用

    return NextResponse.json(stats);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
} 