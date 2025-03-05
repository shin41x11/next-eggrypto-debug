"use client";
import { useState } from 'react';
import React from 'react';
import { styles } from '../styles/dashboardStyles';

export default function BlockchainMint() {
  const [assetTransfers, setAssetTransfers] = useState<unknown>(null);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<{
    totalCount: number;
    maxBlockTimestamp: string | null;
    zeroMonsterIdCount: number;
    maxCreatedAt: string | null;
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [mergeResult, setMergeResult] = useState<unknown>(null);
  const [isLoadingMerge, setIsLoadingMerge] = useState(false);
  const [mergeError, setMergeError] = useState<string | null>(null);

  const fetchAssetTransfers = async () => {
    setError(null);
    setIsLoadingTransfers(true);
    try {
      const res = await fetch('/api/assetTransfers');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setAssetTransfers(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoadingTransfers(false);
    }
  };

  const fetchStats = async () => {
    setStatsError(null);
    setIsLoadingStats(true);
    try {
      const res = await fetch('/api/bcmint/stats');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error fetching stats');
      setStats(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setStatsError(message);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const mergeMonsterId = async () => {
    setMergeError(null);
    setIsLoadingMerge(true);
    try {
      const res = await fetch('/api/mergeMonsterID');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Error: ${res.status} - ${res.statusText}`);
      }
      setMergeResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setMergeError(message);
    } finally {
      setIsLoadingMerge(false);
    }
  };

  React.useEffect(() => {
    fetchStats();
  }, []);

  return (
    <main style={styles.main}>
      <h1 style={styles.header}>Mints Dashboard</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>View Statistics</h2>
        {statsError && <p style={styles.errorText}>Error: {statsError}</p>}
        {isLoadingStats ? (
          <p>Loading statistics...</p>
        ) : stats ? (
          <div>
            <p style={styles.statItem}>Total records: <strong>{stats.totalCount}</strong></p>
            <p style={styles.statItem}>Last Loaded blockTimestamp: <strong>{stats.maxBlockTimestamp || 'N/A'}</strong></p>
            <p style={styles.statItem}>No monsterId Records Count: <strong>{stats.zeroMonsterIdCount}</strong></p>
            <p style={styles.statItem}>Last Fetched time: <strong>{stats.maxCreatedAt || 'N/A'}</strong></p>
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
        ) : null}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Blockchain Data</h2>
        {!isLoadingTransfers && (
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
        )}
        {error && <p style={styles.errorText}>Error: {error}</p>}
        {isLoadingTransfers ? (
          <p>Loading blockchain data...</p>
        ) : assetTransfers !== null ? (
          <div style={styles.jsonDisplay}>
            <pre>{JSON.stringify(assetTransfers, null, 2)}</pre>
          </div>
        ) : null}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Merge MonsterId</h2>
        {!isLoadingStats && (
          <button 
            style={styles.button}
            onClick={mergeMonsterId}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#0056b3';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#0070f3';
            }}
          >
            Merge Monster ID
          </button>
        )}
        {mergeError && <p style={styles.errorText}>Error: {mergeError}</p>}
        {isLoadingMerge ? (
          <p>Merging Monster IDs...</p>
        ) : mergeResult !== null ? (
          <div style={styles.jsonDisplay}>
            <pre>{JSON.stringify(mergeResult, null, 2)}</pre>
          </div>
        ) : null}
      </section>
    </main>
  );
}
