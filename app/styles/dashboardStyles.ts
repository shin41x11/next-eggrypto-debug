// 共通ダッシュボードスタイル定義
export const styles = {
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
  link: {
    color: "#0070f3",
    textDecoration: "underline",
  }
};
