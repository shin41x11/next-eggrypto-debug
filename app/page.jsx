"use client";
import { useState } from 'react';
import React from 'react';

export default function Home() {
  const [monsterId, setMonsterId] = useState(1153);
  const [supplyLimit, setSupplyLimit] = useState(null);
  const [assetTransfers, setAssetTransfers] = useState(null);
  const [error, setError] = useState(null);

  const fetchSupplyLimit = async () => {
    setError(null);
    setSupplyLimit(null);
    try {
      const res = await fetch(`/api/supplyLimit?monsterId=${monsterId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setSupplyLimit(data.supplyLimit);
    } catch (err) {
      setError(err.message);
    }
  };

  // 追加: assetTransfersをボタン押下時に取得する関数
  const fetchAssetTransfers = async () => {
    setError(null);
    setAssetTransfers(null);
    try {
      const res = await fetch('/api/assetTransfers');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setAssetTransfers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>BlockChainMint</h1>
      <button onClick={fetchAssetTransfers}>Fetch Asset Transfers</button>
      {assetTransfers && <pre>{JSON.stringify(assetTransfers, null, 2)}</pre>}
      <div>
        <h1>Supply Limit Checker</h1>
        <input
          type="number"
          value={monsterId}
          onChange={(e) => setMonsterId(e.target.value)}
        />
        <h1>BlockChainMonster</h1>
        <button onClick={fetchSupplyLimit}>Check Supply Limit</button>
        {supplyLimit && <p>Supply Limit: {supplyLimit}</p>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    </main>
  );
}
