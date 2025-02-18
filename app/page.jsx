"use client";
import { useState } from 'react';

export default function Home() {
  const [monsterId, setMonsterId] = useState(1153);
  const [supplyLimit, setSupplyLimit] = useState(null);
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

  return (
    <div>
      <h1>Supply Limit Checker</h1>
      <input
        type="number"
        value={monsterId}
        onChange={(e) => setMonsterId(e.target.value)}
      />
      <button onClick={fetchSupplyLimit}>Check Supply Limit</button>
      {supplyLimit && <p>Supply Limit: {supplyLimit}</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
}
