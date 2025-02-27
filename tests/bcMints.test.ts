import { PrismaClient } from '@prisma/client';

// テスト用のPrismaクライアント
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// テストデータ
const testData = {
  tokenId: 123456789,
  monsterId: 0,
  blockNumber: 13000000,
  blockTimestamp: new Date('2023-01-01T00:00:00Z'),
};

// テストの前後に実行する処理
beforeAll(async () => {
  // テスト開始前の準備
  console.log('テスト開始');
});

afterAll(async () => {
  // テスト終了時のクリーンアップ
  await cleanup();
  await prisma.$disconnect();
  console.log('テスト終了、接続を閉じました');
});

// 各テストの前に実行
beforeEach(async () => {
  // 前のテストデータをクリーンアップ
  await cleanup();
});

// クリーンアップ関数
async function cleanup() {
  try {
    await prisma.bCMints.deleteMany({
      where: {
        tokenId: {
          in: [testData.tokenId, testData.tokenId + 1],
        },
      },
    });
    console.log('テストデータをクリーンアップしました');
  } catch (e) {
    console.error('クリーンアップに失敗しました:', e);
  }
}

describe('BCMints Model Tests', () => {
  
  test('単一レコードの作成と取得', async () => {
    // 1. レコード作成
    const created = await prisma.bCMints.create({
      data: testData,
    });
    
    // 検証
    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(created.tokenId).toBe(testData.tokenId);
    expect(created.monsterId).toBe(testData.monsterId);
    expect(created.blockNumber).toBe(testData.blockNumber);
    
    // 2. レコード取得
    const fetched = await prisma.bCMints.findFirst({
      where: {
        tokenId: testData.tokenId,
      },
    });
    
    // 検証
    expect(fetched).toBeDefined();
    // null チェックを追加
    expect(fetched).not.toBeNull();
    if (fetched) {
      expect(fetched.blockTimestamp).toBeInstanceOf(Date);
      expect(fetched.blockTimestamp.toISOString()).toBe(testData.blockTimestamp.toISOString());
    }
  });
  
  test('createMany で複数レコードを作成', async () => {
    // データ準備
    const bulkData = [
      {
        tokenId: testData.tokenId,
        monsterId: 0,
        blockNumber: 13000001,
        blockTimestamp: new Date('2023-01-01T01:00:00Z'),
      },
      {
        tokenId: testData.tokenId + 1,
        monsterId: 0,
        blockNumber: 13000002,
        blockTimestamp: new Date('2023-01-01T02:00:00Z'),
      },
    ];
    
    // 一括作成
    const createdMany = await prisma.bCMints.createMany({
      data: bulkData,
      skipDuplicates: true,
    });
    
    // 検証
    expect(createdMany.count).toBe(2);
    
    // データが実際に作成されたか確認
    const count = await prisma.bCMints.count({
      where: {
        tokenId: {
          in: [testData.tokenId, testData.tokenId + 1],
        },
      },
    });
    
    expect(count).toBe(2);
  });
  
  test('blockTimestamp に異なる形式のデータを使用', async () => {
    // ISO文字列からのDate生成
    const dateTest = await prisma.bCMints.create({
      data: {
        tokenId: testData.tokenId,
        monsterId: 0,
        blockNumber: 13000003,
        blockTimestamp: new Date('2023-01-01T03:00:00Z'),
      },
    });
    
    expect(dateTest).toBeDefined();
    expect(dateTest.id).toBeDefined();
    
    // タイムスタンプ値を文字列で渡す場合のテスト
    const timestampStr = '2023-01-01T04:00:00.000Z';
    const dateStrTest = await prisma.bCMints.create({
      data: {
        tokenId: testData.tokenId + 1,
        monsterId: 0,
        blockNumber: 13000004,
        blockTimestamp: new Date(timestampStr),
      },
    });
    
    expect(dateStrTest).toBeDefined();
    expect(dateStrTest.blockTimestamp).toBeInstanceOf(Date);
    
    // 取得して確認
    const fetched = await prisma.bCMints.findUnique({
      where: {
        blockNumber: 13000004,
      },
    });
    
    expect(fetched).toBeDefined();
    expect(fetched).not.toBeNull();
    if (fetched) {
      expect(fetched.blockTimestamp).toBeInstanceOf(Date);
      expect(fetched.blockTimestamp.toISOString()).toBe(timestampStr);
    }
  });
  
  test('blockTimestamp に無効な値を使用するとエラーになる', async () => {
    // 無効な日付値でテスト
    await expect(async () => {
      await prisma.bCMints.create({
        data: {
          tokenId: 999999,
          monsterId: 0,
          blockNumber: 13000005,
          // @ts-ignore - あえて型エラーを無視して無効な値をテスト
          blockTimestamp: 'invalid-date',
        },
      });
    }).rejects.toThrow();
  });
  
});
