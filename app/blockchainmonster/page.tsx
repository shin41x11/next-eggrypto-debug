"use client";
import { useState } from 'react';
import React from 'react';

// スタイル定義
const styles = {
  main: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "sans-serif",
  },
  header: {
    color: "#333",
    borderBottom: "2px solid #0070f3",
    paddingBottom: "0.5rem",
    marginBottom: "2rem",
  },
  section: {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "1.5rem",
    marginBottom: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    color: "#0070f3",
    marginTop: "0",
    marginBottom: "1rem",
    fontSize: "1.5rem",
  },
  button: {
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    cursor: "pointer",
    marginTop: "1rem",
    transition: "background-color 0.3s",
  },
  errorText: {
    color: "#d32f2f",
    padding: "0.5rem",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
    marginTop: "1rem",
  },
  statItem: {
    padding: "0.5rem 0",
    borderBottom: "1px solid #eaeaea",
  },
  jsonDisplay: {
    backgroundColor: "#f0f0f0",
    padding: "1rem",
    borderRadius: "4px",
    overflow: "auto",
    maxHeight: "400px",
    fontSize: "0.9rem",
  },
  inputGroup: {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginTop: "0.5rem",
    width: "100%",
  },
  resultsList: {
    listStyleType: "none",
    padding: "0",
  },
  resultItem: {
    padding: "0.5rem 0",
    borderBottom: "1px solid #eaeaea",
  }
};

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