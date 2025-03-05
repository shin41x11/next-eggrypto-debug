import { JsonRpcProvider, Contract, EventLog } from 'ethers';

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

  beforeAll(() => {
    provider = new JsonRpcProvider(POLYGON_RPC_URL);
    contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  });

  it('should fetch CreateMonsterEvent logs', async () => {
    try {
      // Get the latest block number
      const latestBlock = await provider.getBlockNumber();
      console.log('Latest block:', latestBlock);

      // Configure the filter for event logs - looking back 100,000 blocks
      const filter = contract.filters.CreateMonsterEvent();
      const fromBlock = latestBlock - 100000; // Look back further
      console.log('Searching from block:', fromBlock);

      const logs = await contract.queryFilter(filter, fromBlock, 'latest');
      console.log('Found logs:', logs.length);

      // Verify that we got some logs
      expect(logs.length).toBeGreaterThan(0);

      if (logs.length > 0) {
        // Parse and verify the first log
        const firstLog = logs[0] as EventLog;

        // Verify the structure of the parsed log
        expect(firstLog.eventName).toBe('CreateMonsterEvent');
        expect(firstLog.args.length).toBe(5);

        // Log the parsed event for manual verification
        console.log('Parsed CreateMonsterEvent:', {
          tokenId: firstLog.args[0].toString(),
          monsterId: firstLog.args[1].toString(),
          supplyNumber: firstLog.args[2].toString(),
          supplyLimit: firstLog.args[3].toString(),
          userMonsterId: firstLog.args[4].toString(),
        });

        // Additional debug information
        console.log('Event topics:', firstLog.topics);
        console.log('Event data:', firstLog.data);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  }, 30000); // Increase timeout to 30 seconds
}); 