import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 総レコード数を取得
    const totalCount = await prisma.bCMints.count();
    
    // 最大のblockTimestampを取得
    const maxBlockTimestampResult = await prisma.bCMints.findFirst({
      orderBy: {
        blockTimestamp: 'desc',
      },
      select: {
        blockTimestamp: true,
      },
    });
    
    // monsterIdが0のレコード数を取得
    const zeroMonsterIdCount = await prisma.bCMints.count({
      where: {
        monsterId: 0,
      },
    });
    
    // 最大のcreatedAtを取得
    const maxCreatedAtResult = await prisma.bCMints.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        createdAt: true,
      },
    });

    // データを整形
    const stats = {
      totalCount,
      maxBlockTimestamp: maxBlockTimestampResult?.blockTimestamp?.toString() || null,
      zeroMonsterIdCount,
      maxCreatedAt: maxCreatedAtResult?.createdAt?.toISOString() || null,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}