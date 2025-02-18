import { JsonRpcProvider, Contract } from 'ethers';

export async function GET(request) {
  try {
    const provider = new JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/GsNgdBfxcWX8AXy9IZ-rta68ew2P6uO7");
    
    // プロバイダーの接続を待機
    await provider.ready;
    
    const network = await provider.getNetwork();
    console.log('Network details:', {
      chainId: network.chainId,
      name: network.name,
      ensAddress: network.ensAddress
    });

    // プロバイダーの接続状態を確認
    if (!provider.ready) {
      throw new Error('Provider not connected');
    }

    const contractAddress = "0x42b4A7dB1ED930198bC37971b33e86f19cE88600";
    const abi = [
      "function monsterTokenAddress() view returns (address)"
    ];
    
    const contract = new Contract(contractAddress, abi, provider);
    console.log('Contract target:', contract.target);
    
    const monsterTokenAddress = await contract.monsterTokenAddress();
    console.log('Retrieved address:', monsterTokenAddress);

    return new Response(JSON.stringify({ monsterTokenAddress }), { status: 200 });
  } catch (error) {
    console.error('Contract call error:', {
      message: error.message,
      code: error.code,
      transaction: error.transaction
    });
    return new Response(JSON.stringify({ 
      error: error.message,
      details: {
        code: error.code,
        transaction: error.transaction
      }
    }), { status: 500 });
  }
}