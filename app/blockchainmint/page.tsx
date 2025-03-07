"use client";
import { useState } from 'react';
import React from 'react';
import { styles } from '../styles/dashboardStyles';
import { CreateMonsterEventDetail } from '../lib/getCreateMonsterEvents';

export default function BlockchainMint() {
  const [events, setEvents] = useState<CreateMonsterEventDetail[] | null>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<{
    totalCount: number;
    latestBlockNumber: string | null;
    latestTimestamp: string | null;
    latestCreatedAt: string | null;
  } | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setError(null);
    setIsLoadingEvents(true);
    try {
      const res = await fetch('/api/createMonsterEvent/fetch');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setEvents(data.events);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setIsLoadingEvents(false);
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

  React.useEffect(() => {
    fetchStats();
  }, []);

  return (
    <main style={styles.main}>
      <h1 style={styles.header}>Monster Creation Events Dashboard</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>View Statistics</h2>
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
        <h2 style={styles.sectionTitle}>Latest Monster Creation Events</h2>
        {!isLoadingEvents && (
          <button 
            style={styles.button}
            onClick={fetchEvents}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#0056b3';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#0070f3';
            }}
          >
            Fetch Latest Events
          </button>
        )}
        {error && <p style={styles.errorText}>Error: {error}</p>}
        {isLoadingEvents ? (
          <p>Loading events...</p>
        ) : events ? (
          <div style={styles.jsonDisplay}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Block</th>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Monster ID</th>
                  <th style={styles.th}>Supply</th>
                  <th style={styles.th}>Limit</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.transactionHash}>
                    <td style={styles.td}>{event.blockNumber}</td>
                    <td style={styles.td}>{new Date(event.timestamp).toLocaleString()}</td>
                    <td style={styles.td}>{event.eventData.monsterId}</td>
                    <td style={styles.td}>{event.eventData.supplyNumber}</td>
                    <td style={styles.td}>{event.eventData.supplyLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </main>
  );
}
