"use client";
import React from 'react';
import { styles } from './styles/dashboardStyles';

export default function Home() {
  return (
    <main style={styles.main}>
      <h1 style={styles.header}>Top</h1>
      <p>Welcome to this Page. This is studying page for <a href="https://university.alchemy.com/" style={styles.link}>Alchemy University</a>.</p>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Poem</h2>
        <p>The quick brown fox jumps over the lazy dog.</p>
      </section>
    </main>
  );
}
