import { JsonRpcProvider, Contract } from 'ethers';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const monsterIdParam = searchParams.get('monsterId');
  if (!monsterIdParam) {
    return new Response(JSON.stringify({ error: 'monsterId is required' }), { status: 400 });
  }
  
  try {
    const provider = new JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/GsNgdBfxcWX8AXy9IZ-rta68ew2P6uO7");
    const contractAddress = "0x3E2FA0c9aD72703B74d94F489e5D7542F4454778";
    const abi = [
      "function monsterIdToSupplyLimit(uint256) view returns (uint256)"
    ];
    
    const contract = new Contract(contractAddress, abi, provider);
    // monsterId を BigInt に変換
    const monsterId = BigInt(monsterIdParam);
    const supplyLimit = await contract.monsterIdToSupplyLimit(monsterId);
    return new Response(JSON.stringify({ supplyLimit: supplyLimit.toString() }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}