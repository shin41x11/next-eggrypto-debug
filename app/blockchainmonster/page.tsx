"use client";
import { useState } from 'react';
import React from 'react';

export default function BlockchainMonster() {
  const [monsterId, setMonsterId] = useState<number>(1153);
  const [supplyLimit, setSupplyLimit] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSupplyLimit = async () => {
    setError(null);
    setSupplyLimit(null);
    try {
      const res = await fetch(`/api/supplyLimit?monsterId=${monsterId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setSupplyLimit(data.supplyLimit);
    } catch (err: unknown) { // 修正前: err: any
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <div>
        <h1>Supply Limit Checker</h1>
        <input
          type="number"
          value={monsterId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonsterId(Number(e.target.value))}
        />
        <h1>BlockChainMonster</h1>
        <button onClick={fetchSupplyLimit}>Check Supply Limit</button>
        {supplyLimit && <p>Supply Limit: {supplyLimit}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    </main>
  );
}
