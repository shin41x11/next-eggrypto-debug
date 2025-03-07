import { JsonRpcProvider, Contract, EventLog, Log, Interface } from 'ethers';

const POLYGON_RPC_URL = 'https://polygon-mainnet.g.alchemy.com/v2/GsNgdBfxcWX8AXy9IZ-rta68ew2P6uO7';
const CONTRACT_ADDRESS = '0x3E2FA0c9aD72703B74d94F489e5D7542F4454778';

// ABI for CreateMonsterEvent with indexed parameters
const CONTRACT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "monsterId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "supplyNumber",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "supplyLimit",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "userMonsterId",
        type: "uint256"
      }
    ],
    name: "CreateMonsterEvent",
    type: "event"
  }
];

describe('CreateMonsterEvent Tests', () => {
  let provider: JsonRpcProvider;
  let contract: Contract;
  let iface: Interface;

  beforeAll(() => {
    provider = new JsonRpcProvider(POLYGON_RPC_URL);
    contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    iface = new Interface(CONTRACT_ABI);
  });

  it('should fetch the first 100 CreateMonsterEvent logs', async () => {
    try {
      // Get the latest block number
      const latestBlock = await provider.getBlockNumber();
      console.log('Latest block:', latestBlock);

      // Initialize variables for pagination
      const BATCH_SIZE = 500000; // Number of blocks to search in each batch
      const TARGET_EVENT_COUNT = 100; // Number of events we want to find
      let allLogs: Log[] = [];
      let currentFromBlock = 13000026; // Start from the beginning
      let currentToBlock = currentFromBlock + BATCH_SIZE;

      // Configure the filter for event logs
      const filter = contract.filters.CreateMonsterEvent();

      // Keep fetching until we have enough events or reach the latest block
      while (allLogs.length < TARGET_EVENT_COUNT && currentFromBlock < latestBlock) {
        console.log(`Searching blocks ${currentFromBlock} to ${currentToBlock}`);
        
        const logs = await contract.queryFilter(filter, currentFromBlock, currentToBlock);
        allLogs = [...allLogs, ...logs];
        
        console.log(`Found ${logs.length} logs in this batch. Total logs: ${allLogs.length}`);
        
        // Update block range for next iteration
        currentFromBlock = currentToBlock + 1;
        currentToBlock = Math.min(currentFromBlock + BATCH_SIZE, latestBlock);
      }

      // Take only the first 100 events and parse them
      const targetLogs = allLogs.slice(0, TARGET_EVENT_COUNT).map(log => {
        const parsedLog = iface.parseLog({
          topics: log.topics as string[],
          data: log.data
        });
        return {
          ...log,
          args: parsedLog?.args || [],
          eventName: parsedLog?.name || ''
        };
      });

      console.log(`Processing ${targetLogs.length} oldest events`);

      // Get block information for each log
      const eventDetails = await Promise.all(
        targetLogs.map(async (log) => {
          const block = await provider.getBlock(log.blockNumber);
          return {
            blockNumber: log.blockNumber,
            timestamp: block?.timestamp 
              ? new Date(Number(block.timestamp) * 1000).toISOString()
              : 'unknown',
            transactionHash: log.transactionHash,
            eventData: {
              tokenId: log.args[0].toString(),
              monsterId: log.args[1].toString(),
              supplyNumber: log.args[2].toString(),
              supplyLimit: log.args[3].toString(),
              userMonsterId: log.args[4].toString(),
            }
          };
        })
      );

      // Sort events by block number to ensure chronological order
      eventDetails.sort((a, b) => a.blockNumber - b.blockNumber);

      // Log detailed event information
      console.log('Event Details (oldest to newest):');
      eventDetails.forEach((detail, index) => {
        console.log(`\nEvent ${index + 1}:`);
        console.log('Block Number:', detail.blockNumber);
        console.log('Timestamp:', detail.timestamp);
        console.log('Transaction Hash:', detail.transactionHash);
        console.log('Event Data:', detail.eventData);
      });

      // Verify that we got some logs
      expect(eventDetails.length).toBeGreaterThan(0);
      expect(eventDetails.length).toBeLessThanOrEqual(TARGET_EVENT_COUNT);

      // Verify the structure of the first log
      const firstLog = targetLogs[0];
      expect(firstLog.eventName).toBe('CreateMonsterEvent');
      expect(firstLog.args.length).toBe(5);

    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }, 120000); // Increase timeout to 120 seconds for batch processing
}); 