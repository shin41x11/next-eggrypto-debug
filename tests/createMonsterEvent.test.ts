import { getCreateMonsterEvents } from '../app/lib/getCreateMonsterEvents';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('CreateMonsterEvent Tests', () => {
  // Cleanup after all tests
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should fetch and store CreateMonsterEvent logs', async () => {
    try {
      const eventDetails = await getCreateMonsterEvents();

      // Log detailed event information
      console.log('Event Details (oldest to newest):');
      eventDetails.forEach((detail, index) => {
        console.log(`\nEvent ${index + 1}:`);
        console.log('Block Number:', detail.blockNumber);
        console.log('Timestamp:', detail.timestamp);
        console.log('Transaction Hash:', detail.transactionHash);
        console.log('Event Data:', detail.eventData);
      });

      // Store events in database
      console.log('\nStoring events in database...');
      const createPromises = eventDetails.map(async (detail) => {
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
      });

      const results = await Promise.all(createPromises);
      console.log(`Successfully stored ${results.length} events`);

      // Verify database storage
      const storedEvents = await prisma.createMonsterEvent.findMany({
        where: {
          transactionHash: {
            in: eventDetails.map(detail => detail.transactionHash)
          }
        },
        orderBy: {
          blockNumber: 'asc'
        }
      });

      // Verify that we got some logs
      expect(storedEvents.length).toBeGreaterThan(0);
      expect(storedEvents.length).toBeLessThanOrEqual(100);

      // Verify the structure of the first event
      const firstEvent = storedEvents[0];
      expect(firstEvent).toHaveProperty('tokenId');
      expect(firstEvent).toHaveProperty('monsterId');
      expect(firstEvent).toHaveProperty('supplyNumber');
      expect(firstEvent).toHaveProperty('supplyLimit');
      expect(firstEvent).toHaveProperty('userMonsterId');

      // Log storage results
      console.log('\nVerification of stored events:');
      console.log(`Total events stored: ${storedEvents.length}`);
      console.log('First stored event:', {
        blockNumber: firstEvent.blockNumber.toString(),
        timestamp: firstEvent.timestamp,
        transactionHash: firstEvent.transactionHash,
        tokenId: firstEvent.tokenId,
        monsterId: firstEvent.monsterId,
        supplyNumber: firstEvent.supplyNumber,
        supplyLimit: firstEvent.supplyLimit,
        userMonsterId: firstEvent.userMonsterId,
      });

    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, 120000); // Increase timeout to 120 seconds for batch processing
}); 