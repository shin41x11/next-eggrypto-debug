import { fetchAndStoreCreateMonsterEvents, getCreateMonsterEventStats } from '../app/lib/createMonsterEvent';

describe('CreateMonsterEvent Tests', () => {
  it('should fetch, store and retrieve CreateMonsterEvent logs', async () => {
    try {
      // イベントを取得して保存
      const result = await fetchAndStoreCreateMonsterEvents();
      const events = result.events;

      // Log detailed event information
      console.log('Event Details (oldest to newest):');
      events.forEach((detail, index) => {
        console.log(`\nEvent ${index + 1}:`);
        console.log('Block Number:', detail.blockNumber);
        console.log('Timestamp:', detail.timestamp);
        console.log('Transaction Hash:', detail.transactionHash);
        console.log('Event Data:', detail.eventData);
      });

      // 統計情報を取得
      const stats = await getCreateMonsterEventStats();
      console.log('\nStats:', stats);

      // Verify that we got some logs
      expect(events.length).toBeGreaterThan(0);
      expect(events.length).toBeLessThanOrEqual(10);

      // Verify the structure of the first event
      const firstEvent = events[0];
      expect(firstEvent.eventData).toHaveProperty('tokenId');
      expect(firstEvent.eventData).toHaveProperty('monsterId');
      expect(firstEvent.eventData).toHaveProperty('supplyNumber');
      expect(firstEvent.eventData).toHaveProperty('supplyLimit');
      expect(firstEvent.eventData).toHaveProperty('userMonsterId');

      // Verify stats
      expect(stats.totalCount).toBeGreaterThan(0);
      expect(stats.latestBlockNumber).not.toBeNull();
      expect(stats.latestTimestamp).not.toBeNull();
      expect(stats.latestCreatedAt).not.toBeNull();

    } catch (error) {
      console.error('Error in test:', error);
      throw error;
    }
  }, 120000); // Increase timeout to 120 seconds for batch processing
}); 