"use client";
import { useState, useEffect } from 'react';
import React from 'react';
import { styles } from '../styles/dashboardStyles';
import { CreateMonsterEventTable } from '../components/CreateMonsterEventTable';

interface CreateMonsterEvent {
  id: number;
  blockNumber: string;
  timestamp: string;
  transactionHash: string;
  tokenId: string;
  monsterId: string;
  supplyNumber: string;
  supplyLimit: string;
  userMonsterId: string;
  createdAt: string;
}

export default function BlockchainMint() {
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateCount, setLastUpdateCount] = useState<number | null>(null);
  const [events, setEvents] = useState<CreateMonsterEvent[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const [stats, setStats] = useState<{
    totalCount: number;
    latestBlockNumber: string | null;
    latestTimestamp: string | null;
    latestCreatedAt: string | null;
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const fetchEvents = async (startBlock?: number) => {
    setError(null);
    setIsLoadingEvents(true);
    try {
      const queryParams = new URLSearchParams({
        limit: '100',
      });
      if (startBlock) {
        queryParams.append('startBlock', startBlock.toString());
      }
      const res = await fetch(`/api/createMonsterEvent/fetch?${queryParams.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setLastUpdateCount(data.updatedCount);
      // イベント取得後に統計情報を更新
      await fetchStats();
      // テーブルデータも更新
      await fetchTableData();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const fetchTableData = async () => {
    setIsLoadingTable(true);
    try {
      const res = await fetch('/api/createMonsterEvent/list');
      const data = await res.json();
      console.log('Fetched events:', data);
      if (!res.ok) throw new Error(data.error || 'Error fetching events');
      setEvents(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Error fetching table data:', err);
      setError(message);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const fetchStats = async () => {
    setStatsError(null);
    setIsLoadingStats(true);
    try {
      const res = await fetch('/api/createMonsterEvent/stats');
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

  useEffect(() => {
    fetchStats();
    fetchTableData();
  }, []);

  return (
    <main style={styles.main}>
      <h1 style={styles.header}>Monster Creation Events Dashboard</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Load Events</h2>
        {!isLoadingEvents && (
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button 
              style={styles.button}
              onClick={() => {
                fetchEvents();
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#0056b3';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#0070f3';
              }}
            >
              Load More Events
            </button>
          </div>
        )}
        {error && <p style={styles.errorText}>Error: {error}</p>}
        {isLoadingEvents && <p>Loading events...</p>}
        {lastUpdateCount !== null && !isLoadingEvents && (
          <p style={styles.successText}>Successfully updated {lastUpdateCount} records.</p>
        )}
      </section>
      
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Statistics</h2>
        {statsError && <p style={styles.errorText}>Error: {statsError}</p>}
        {isLoadingStats ? (
          <p>Loading statistics...</p>
        ) : stats ? (
          <div>
            <p style={styles.statItem}>Total records: <strong>{stats.totalCount}</strong></p>
            <p style={styles.statItem}>Latest Block Number: <strong>{stats.latestBlockNumber || 'N/A'}</strong></p>
            <p style={styles.statItem}>Latest Event Time: <strong>{stats.latestTimestamp || 'N/A'}</strong></p>
            <p style={styles.statItem}>Last Fetched time: <strong>{stats.latestCreatedAt || 'N/A'}</strong></p>
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
        <h2 style={styles.sectionTitle}>Event List</h2>
        {isLoadingTable ? (
          <p>Loading events...</p>
        ) : (
          <CreateMonsterEventTable data={events} />
        )}
      </section>
    </main>
  );
}
