import { PrismaClient, EnvType, LoadType } from '@prisma/client';

const prisma = new PrismaClient();

describe('BCLoads Model', () => {
  it('should create a new BCLoad record', async () => {
    const newLoad = await prisma.bCLoads.create({
      data: {
        envType: EnvType.TESTNET,
        loadType: LoadType.MINT,
        lastBlockNumber: 'x123456',
      },
    });

    expect(newLoad).toHaveProperty('id');
    expect(newLoad.envType).toBe(EnvType.TESTNET);
    expect(newLoad.loadType).toBe(LoadType.MINT);
    expect(newLoad.lastBlockNumber).toBe('x123456');
  });
});