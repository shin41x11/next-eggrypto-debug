import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching monsters from database...');
    const monsters = await prisma.bCMonsters.findMany({
      orderBy: [
        { monsterId: 'asc' }
      ],
    });
    console.log(`Found ${monsters.length} monsters`);

    return NextResponse.json(monsters);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch monsters' },
      { status: 500 }
    );
  }
} 