import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // monsterIdが未セット(0)のレコードを１件取得
    const record = await prisma.bCMints.findFirst({
      where: {
        monsterId: 0,
      },
    });

    if (!record) {
      console.log('No record found with monsterId 0');
      return NextResponse.json(
        { message: 'No records to merge' },
        { status: 404 }
      );
    }

    console.log('Found record:', record);

    // tokenIdを使用してEggrypto APIにリクエスト
    const response = await fetch(`https://game.eggrypto.com/api/monster/info/${record.tokenId}`);
    
    if (!response.ok) {
      console.error('Eggrypto API error:', response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch data from Eggrypto API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Eggrypto API response:', data);

    // monsterIdを更新
    const updatedRecord = await prisma.bCMints.update({
      where: { id: record.id },
      data: { monsterId: data.monsterId },
    });

    console.log('Updated record:', updatedRecord);

    return NextResponse.json({
      message: 'Monster ID merged successfully',
      updatedRecord,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to merge Monster ID' },
      { status: 500 }
    );
  }
}