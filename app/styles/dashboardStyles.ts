import { CSSProperties } from 'react';

interface ExtendedCSSProperties extends CSSProperties {
  '&:hover'?: CSSProperties;
}

interface Styles {
  main: CSSProperties;
  header: CSSProperties;
  section: CSSProperties;
  sectionTitle: CSSProperties;
  button: ExtendedCSSProperties;
  errorText: CSSProperties;
  successText: CSSProperties;
  statItem: CSSProperties;
  link: ExtendedCSSProperties;
  nav: CSSProperties;
  navList: CSSProperties;
  navLink: ExtendedCSSProperties;
  table: CSSProperties;
  th: CSSProperties;
  td: CSSProperties;
  jsonDisplay: CSSProperties;
  inputGroup: CSSProperties;
  input: CSSProperties;
  resultsList: CSSProperties;
  resultItem: CSSProperties;
}

// 共通ダッシュボードスタイル定義
export const styles: Styles = {
  main: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    color: "#333",
    marginBottom: "30px",
  },
  section: {
    marginBottom: "40px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    color: "#444",
    marginBottom: "20px",
  },
  button: {
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    '&:hover': {
      backgroundColor: "#0056b3",
    },
  },
  errorText: {
    color: "#dc3545",
    marginTop: "10px",
  },
  successText: {
    color: "#28a745",
    marginTop: "10px",
  },
  statItem: {
    marginBottom: "10px",
    fontSize: "16px",
  },
  link: {
    color: "#0070f3",
    textDecoration: "none",
    '&:hover': {
      textDecoration: "underline",
    },
  },
  nav: {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    marginBottom: "2rem",
  },
  navList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    gap: "20px",
  },
  navLink: {
    color: "#333",
    textDecoration: "none",
    fontSize: "16px",
    '&:hover': {
      color: "#0070f3",
    },
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    backgroundColor: "#f8f9fa",
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #dee2e6",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #dee2e6",
  },
  jsonDisplay: {
    overflowX: "auto",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "5px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  resultsList: {
    listStyle: "none",
    padding: 0,
  },
  resultItem: {
    padding: "10px",
    borderBottom: "1px solid #eee",
  },
};
