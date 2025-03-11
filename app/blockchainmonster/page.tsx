"use client";
import { useState } from 'react';
import React from 'react';
import { styles } from '../styles/dashboardStyles';

export default function BlockchainMonster() {
  const [error, setError] = useState<string | null>(null);

  // 複数のmonsterIdをカンマ区切りの文字列で入力（例: "1153,2001"）
  const [monsterIds, setMonsterIds] = useState<string>('1304,1307');
  const [supplyLimits, setSupplyLimits] = useState<Record<string, { limit: string; number: string }> | null>(null);

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

  return (
    <main style={styles.main}>
      <h1 style={styles.header}>Blockchain Monster Dashboard</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Supply Limit Checker</h2>
        <div style={styles.inputGroup}>
          <label htmlFor="monster-ids">Enter Monster IDs (comma separated):</label>
          <input
            id="monster-ids"
            type="text"
            value={monsterIds}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonsterIds(e.target.value)}
            style={styles.input}
          />
        </div>
        <button 
          style={styles.button}
          onClick={fetchSupplyLimits}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#0070f3';
          }}
        >
          Check Supplies
        </button>
        
        {error && <p style={styles.errorText}>Error: {error}</p>}
      </section>

      {supplyLimits && (
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Results</h2>
          <ul style={styles.resultsList}>
            {Object.entries(supplyLimits).map(([id, info]) => (
              <li key={id} style={styles.resultItem}>
                <strong>Monster ID:</strong> {id} - <strong>Supply Limit:</strong> {info.limit} - <strong>Supply Count:</strong> {info.number}
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}