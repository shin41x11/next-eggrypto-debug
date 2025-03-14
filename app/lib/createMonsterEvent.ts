import { prisma } from './prisma';
import { getCreateMonsterEvents, CreateMonsterEventDetail } from './getCreateMonsterEvents';

export async function fetchAndStoreCreateMonsterEvents(options?: {
  limit?: number;
  startBlock?: number;
}): Promise<{
  message: string;
  events: CreateMonsterEventDetail[];
  nextStartBlock?: number;
  updatedCount: number;
}> {
  try {
    // 最新のイベントのブロック番号を取得（startBlockが指定されていない場合）
    let startBlock = options?.startBlock;
    if (!startBlock) {
      const latestEvent = await prisma.createMonsterEvent.findFirst({
        orderBy: [
          { blockNumber: 'desc' },
        ],
        select: {
          blockNumber: true,
        },
      });
      startBlock = latestEvent ? Number(latestEvent.blockNumber) : 13000026; // デフォルトの開始ブロック
    }

    // イベントを取得
    const events = await getCreateMonsterEvents({
      limit: options?.limit || 10,
      startBlock: startBlock,
    });

    // 取得したイベントをデータベースに保存
    const createResults = await Promise.all(events.map(async (detail) => {
      try {
        return await prisma.createMonsterEvent.upsert({
          where: {
            transactionHash: detail.transactionHash,
          },
          update: {
            blockNumber: BigInt(detail.blockNumber),
            timestamp: new Date(detail.timestamp),
            tokenId: detail.eventData.tokenId,
            monsterId: detail.eventData.monsterId,
            supplyNumber: detail.eventData.supplyNumber,
            supplyLimit: detail.eventData.supplyLimit,
            userMonsterId: detail.eventData.userMonsterId,
          },
          create: {
            blockNumber: BigInt(detail.blockNumber),
            timestamp: new Date(detail.timestamp),
            transactionHash: detail.transactionHash,
            tokenId: detail.eventData.tokenId,
            monsterId: detail.eventData.monsterId,
            supplyNumber: detail.eventData.supplyNumber,
            supplyLimit: detail.eventData.supplyLimit,
            userMonsterId: detail.eventData.userMonsterId,
          },
        });
      } catch (error) {
        console.error(`Error storing event with hash ${detail.transactionHash}:`, error);
        throw error;
      }
    }));

    // 次の取得開始ブロック番号を計算
    const nextStartBlock = events.length > 0 
      ? Math.min(...events.map(e => Number(e.blockNumber))) - 1
      : undefined;

    return {
      message: "Events fetched and stored successfully",
      events: events,
      nextStartBlock,
      updatedCount: createResults.length
    };
  } catch (error) {
    console.error('Error in fetchAndStoreCreateMonsterEvents:', error);
    throw error;
  }
}

export async function getCreateMonsterEventStats() {
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

    // データを整形
    return {
      totalCount,
      latestBlockNumber: latestEvent ? latestEvent.blockNumber.toString() : null,
      latestTimestamp: latestEvent?.timestamp?.toISOString() || null,
      latestCreatedAt: latestEvent?.createdAt?.toISOString() || null,
    };
  } catch (error) {
    console.error('Error in getCreateMonsterEventStats:', error);
    throw error;
  }
} 