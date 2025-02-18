export async function getAssetTransfers() {
  const url = "https://polygon-mainnet.g.alchemy.com/v2/GsNgdBfxcWX8AXy9IZ-rta68ew2P6uO7";
  const body = {
    id: 1,
    jsonrpc: "2.0",
    method: "alchemy_getAssetTransfers",
    params: [
      {
        fromBlock: "0x0",
        toBlock: "latest",
        fromAddress: "0x0000000000000000000000000000000000000000",
        contractAddresses: ["0x42b4A7dB1ED930198bC37971b33e86f19cE88600"],
        category: ["erc721"],
        order: "desc",
        withMetadata: true,
        maxCount: "0x9"
      }
    ]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error('Failed to fetch asset transfers');
  }

  return await res.json();
}

