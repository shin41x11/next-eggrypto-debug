"use client";
import { useState } from 'react';
import React from 'react';

export default function BlockchainMint() {
  const [assetTransfers, setAssetTransfers] = useState<unknown>(null); // 修正前: any
  const [error, setError] = useState<string | null>(null);

  const fetchAssetTransfers = async () => {
    setError(null);
    setAssetTransfers(null);
    try {
      const res = await fetch('/api/assetTransfers');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setAssetTransfers(data);
    } catch (err: unknown) { // 修正前: any
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>BlockchainMint</h1>
      <section>
        <button onClick={fetchAssetTransfers}>Fetch Asset Transfers</button>
        {assetTransfers !== null && <pre>{JSON.stringify(assetTransfers, null, 2)}</pre>}
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </section>
    </main>
  );
}
