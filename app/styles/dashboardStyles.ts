import { CSSProperties } from 'react';

// 共通ダッシュボードスタイル定義
export const styles: { [key: string]: CSSProperties } = {
  main: {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "system-ui, sans-serif",
  },
  header: {
    color: "#333",
    borderBottom: "2px solid #eaeaea",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  section: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sectionTitle: {
    color: "#444",
    marginBottom: "15px",
  },
  button: {
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    marginTop: "10px",
  },
  errorText: {
    color: "#ff0000",
    marginTop: "10px",
  },
  statItem: {
    marginBottom: "10px",
    fontSize: "16px",
  },
  jsonDisplay: {
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#f7f7f7",
    borderRadius: "5px",
    overflow: "auto",
  },
  inputGroup: {
    marginBottom: "1rem",
    display: "flex",
    flexDirection: 'column' as const
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
  },
  nav: {
    backgroundColor: "#333",
    padding: "1rem",
    color: "white",
  },
  navList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    gap: "1rem",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    ":hover": {
      textDecoration: "underline",
    },
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
    fontSize: "14px",
  },
  th: {
    backgroundColor: "#f4f4f4",
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
};
