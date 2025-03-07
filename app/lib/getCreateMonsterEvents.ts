import { JsonRpcProvider, Contract, Log, Interface } from 'ethers';

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

export interface CreateMonsterEventDetail {
  blockNumber: number;
  timestamp: string;
  transactionHash: string;
  eventData: {
    tokenId: string;
    monsterId: string;
    supplyNumber: string;
    supplyLimit: string;
    userMonsterId: string;
  };
}

export interface GetCreateMonsterEventsOptions {
  startBlock?: number;
  batchSize?: number;
  limit?: number;
}

export async function getCreateMonsterEvents(options: GetCreateMonsterEventsOptions = {}): Promise<CreateMonsterEventDetail[]> {
  const {
    startBlock = 13000026,
    batchSize = 500000,
    limit = 100
  } = options;

  const provider = new JsonRpcProvider(POLYGON_RPC_URL);
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  const iface = new Interface(CONTRACT_ABI);

  try {
    // Get the latest block number
    const latestBlock = await provider.getBlockNumber();

    // Initialize variables for pagination
    let allLogs: Log[] = [];
    let currentFromBlock = startBlock;
    let currentToBlock = currentFromBlock + batchSize;

    // Configure the filter for event logs
    const filter = contract.filters.CreateMonsterEvent();

    // Keep fetching until we have enough events or reach the latest block
    while (allLogs.length < limit && currentFromBlock < latestBlock) {
      const logs = await contract.queryFilter(filter, currentFromBlock, currentToBlock);
      allLogs = [...allLogs, ...logs];
      
      // Update block range for next iteration
      currentFromBlock = currentToBlock + 1;
      currentToBlock = Math.min(currentFromBlock + batchSize, latestBlock);
    }

    // Take only the requested number of events and parse them
    const targetLogs = allLogs.slice(0, limit).map(log => {
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
    return eventDetails.sort((a, b) => a.blockNumber - b.blockNumber);

  } catch (error) {
    console.error('Error fetching CreateMonsterEvent logs:', error);
    throw error;
  }
} 