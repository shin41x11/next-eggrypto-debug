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

    const provider = new JsonRpcProvider("https://polygon-mainnet.g.alchemy.com/v2/GsNgdBfxcWX8AXy9IZ-rta68ew2P6uO7");
    const contractAddress = "0x3E2FA0c9aD72703B74d94F489e5D7542F4454778";
    const abi = [
      "function monsterIdToSupplyLimit(uint256) view returns (uint256)"
    ];

    const contract = new Contract(contractAddress, abi, provider);

    const results = await Promise.all(monsterIds.map(async (id) => {
      const supplyLimit = await contract.monsterIdToSupplyLimit(BigInt(id));
      return [id, supplyLimit.toString()];
    }));

    const responseData = Object.fromEntries(results);
    return NextResponse.json(responseData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}