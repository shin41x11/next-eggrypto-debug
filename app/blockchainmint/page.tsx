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
};

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

    // Add these state and effect declarations near the top of your component
    const [stats, setStats] = useState<{
      totalCount: number;
      maxBlockTimestamp: string | null;
      zeroMonsterIdCount: number;
      maxCreatedAt: string | null;
    } | null>(null);
    const [statsError, setStatsError] = useState<string | null>(null);

    const fetchStats = async () => {
      setStatsError(null);
      try {
        const res = await fetch('/api/bcmint/stats');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error fetching stats');
        setStats(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setStatsError(message);
      }
    };

    // Call fetchStats when component mounts
    React.useEffect(() => {
      fetchStats();
    }, []);

  return (
    <main style={styles.main}>
      <h1 style={styles.header}>Blockchain Mint Dashboard</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>View Statistics</h2>
        {statsError && <p style={styles.errorText}>Error: {statsError}</p>}
        {stats ? (
          <div>
            <p style={styles.statItem}>Total records: <strong>{stats.totalCount}</strong></p>
            <p style={styles.statItem}>Max blockTimestamp: <strong>{stats.maxBlockTimestamp || 'N/A'}</strong></p>
            <p style={styles.statItem}>Records with monsterId = 0: <strong>{stats.zeroMonsterIdCount}</strong></p>
            <p style={styles.statItem}>Max createdAt: <strong>{stats.maxCreatedAt || 'N/A'}</strong></p>
            <button 
              style={styles.button} 
              onClick={fetchStats}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#0056b3';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#0070f3';
              }}
            >
              Refresh Stats
            </button>
          </div>
        ) : (
          <p>Loading statistics...</p>
        )}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Blockchain Data</h2>
        <button 
          style={styles.button}
          onClick={fetchAssetTransfers}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#0056b3';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#0070f3';
          }}
        >
          Fetch Blockchain Data
        </button>
        {error && <p style={styles.errorText}>Error: {error}</p>}
        {assetTransfers !== null && (
          <div style={styles.jsonDisplay}>
            <pre>{JSON.stringify(assetTransfers, null, 2)}</pre>
          </div>
        )}
      </section>
    </main>
  );
}
