"use client";
import { useState } from 'react';
import React from 'react';

export default function BlockchainMonster() {
  // 複数のmonsterIdをカンマ区切りの文字列で入力（例: "1153,2001"）
  const [monsterIds, setMonsterIds] = useState<string>(() =>
    Array.from({ length: 101 }, (_, i) => i + 100).join(',')
  );
  const [supplyLimits, setSupplyLimits] = useState<Record<string, { limit: string; number: string }> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSupplyLimits = async () => {
    setError(null);
    setSupplyLimits(null);
    try {
      // クエリパラメータに複数のmonsterIdを送信
      const res = await fetch(`/api/supplyLimit?monsterIds=${encodeURIComponent(monsterIds)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
    console.log(data);
    setSupplyLimits(data);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  };

  console.log(supplyLimits);

  return (
    <main style={{ padding: "2rem" }}>
      <div>
        <h1>Supply Limit Checker</h1>
        <label>
          Enter Monster IDs (comma separated):
          <input
            type="text"
            value={monsterIds}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonsterIds(e.target.value)}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <h1>BlockChainMonster</h1>
        <button onClick={fetchSupplyLimits}>Check Supplys</button>
       
        {supplyLimits && (
          <div>
            <h2>Results:</h2>
            <ul>
              {Object.entries(supplyLimits).map(([id, info]) => (
                              <li key={id}>
                                Monster ID: {id} - Supply Limit: {info.limit} - Supply Count: {info.number}
                              </li>
                            ))}
            </ul>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    </main>
  );
}