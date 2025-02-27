import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function GET() {

  try {
    // SQLクエリをログに出力するよう設定
    const prisma = new PrismaClient({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
        {
          emit: 'stdout',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
      ],
    });

    // bcMintsテーブルから最大のblockNumberを取得
    const maxRecord = await prisma.bCMints.findFirst({
      orderBy: { blockNumber: "desc" },
      select: { blockNumber: true },
    });
    const fromBlock = maxRecord ? `0x${(maxRecord.blockNumber + 1).toString(16)}` : "0x0";

    console.log("fromBlock:", fromBlock);

    // Alchemy API URLとリクエストbodyを設定（fromBlockを動的にセット）
    const url = "https://polygon-mainnet.g.alchemy.com/v2/GsNgdBfxcWX8AXy9IZ-rta68ew2P6uO7";
    const body = JSON.stringify({
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock,
          toBlock: "latest",
          fromAddress: "0x0000000000000000000000000000000000000000",
          contractAddresses: ["0x42b4A7dB1ED930198bC37971b33e86f19cE88600"],
          category: ["erc721"],
          order: "asc",
          withMetadata: true,
          maxCount: "0x64"
        }
      ]
    });

    // Alchemy APIへPOSTリクエスト
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });

    if (!res.ok) {
      throw new Error("Failed to fetch asset transfers");
    }

    const data = await res.json();
    // レスポンス内のtransfers配列を取得
    const transfers = data.result?.transfers;
    if (!Array.isArray(transfers) || transfers.length === 0) {
      return NextResponse.json({ error: "No transfers found" }, { status: 400 });
    }

//    console.log("transfers:", transfers);

    // Prisma Clientを使ってBCMintsに一括保存
    const records = transfers.map((transfer: any) => {
      // tokenIdは16進数文字列なので整数に変換
      const tokenIdInt = parseInt(transfer.tokenId, 16);
      const blockNumberInt = parseInt(transfer.blockNum, 16);
      
      // タイムスタンプ処理（ミリ秒を除去）
      let timestamp = transfer.metadata?.blockTimestamp || new Date().toISOString();

      return {
        tokenId: tokenIdInt,
        monsterId: 0,
        blockNumber: blockNumberInt,
        blockTimestamp: new Date(timestamp), // 明示的にDateオブジェクトを生成
      };
    });

    try {
      const createResult = await prisma.bCMints.createMany({
        data: records,
        skipDuplicates: true
      });
      console.log("createMany result:", createResult);
    } catch (err: any) {
      console.error("createMany error:", err?.response || err);
      throw err;
    }

    await prisma.$disconnect();

    return NextResponse.json({ message: "Records saved successfully", count: records.length });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}