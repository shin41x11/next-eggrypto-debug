import { NextRequest, NextResponse } from "next/server";
import { JsonRpcProvider, Contract } from "ethers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const monsterIdsParam = searchParams.get("monsterIds");

  if (!monsterIdsParam) {
    return NextResponse.json({ error: "monsterIds is required" }, { status: 400 });
  }

  try {
    const monsterIds = monsterIdsParam.split(",").map(id => id.trim()).filter(id => id !== "");
    if (monsterIds.length === 0) {
      return NextResponse.json({ error: "No valid monsterIds provided" }, { status: 400 });
    }

//    const ethProvider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/GsNgdBfxcWX8AXy9IZ-rta68ew2P6uO7");

    const provider = new JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/GsNgdBfxcWX8AXy9IZ-rta68ew2P6uO7");
    
    const contractAddress = "0x3E2FA0c9aD72703B74d94F489e5D7542F4454778";
    const abiSupplyLimit = [
      "function monsterIdToSupplyLimit(uint256) view returns (uint256)"
    ];
    const abiTotalSupply = [
      "function monsterIdToTotalSupply(uint256) view returns (uint256)"
    ];
    const supplyLimitContract = new Contract(contractAddress, abiSupplyLimit, provider);
    const totalSupplyContract = new Contract(contractAddress, abiTotalSupply, provider);

    const results = await Promise.all(monsterIds.map(async (id) => {
      const [supplyLimit, supplyNumber] = await Promise.all([
      supplyLimitContract.monsterIdToSupplyLimit(BigInt(id)),
      totalSupplyContract.monsterIdToTotalSupply(BigInt(id))
      ]);
      return [id, supplyLimit.toString(), supplyNumber.toString()];
    }));

    console.log("Results:", results);

//    const responseData = Object.fromEntries(results);

const responseData = results.reduce<Record<string, { limit: string; number: string }>>((acc, [id, supplyLimit, supplyNumber]) => {
  acc[id] = { limit: supplyLimit, number: supplyNumber };
  return acc;
}, {});

    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}