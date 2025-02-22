import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('BCLoads Model', () => {
  it('should create a new BCLoad record', async () => {
    const newLoad = await prisma.bCLoads.create({
      data: {
        envType: 1,
        loadType: 1,
        lastBlockNumber: 'x123456',
      },
    });

    expect(newLoad).toHaveProperty('id');
    expect(newLoad.envType).toBe(1);
    expect(newLoad.loadType).toBe(1);
    expect(newLoad.lastBlockNumber).toBe('x123456');
  });
});