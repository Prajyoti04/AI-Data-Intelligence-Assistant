function DataPreview({ data }) {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Dataset Preview</div>
          <div style={styles.subtitle}>
            Showing first {data.length} rows · {columns.length} columns
          </div>
        </div>
        <span style={styles.badge}>{data.length} rows</span>
      </div>

      <div style={styles.tableWrap}>
        <table className="data-table" style={{ minWidth: `${columns.length * 140}px` }}>
          <thead>
            <tr>
              <th style={styles.indexTh}>#</th>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td style={styles.indexTd}>{idx + 1}</td>
                {columns.map((col) => {
                  const val = row[col];
                  const isEmpty = val === null || val === undefined || val === "";
                  return (
                    <td key={col}>
                      {isEmpty ? (
                        <span style={styles.nullBadge}>null</span>
                      ) : (
                        String(val)
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: "white",
    borderRadius: "var(--border-radius-lg)",
    boxShadow: "var(--shadow-md)",
    border: "1px solid var(--color-slate-200)",
    overflow: "hidden",
    marginTop: "28px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px 16px",
    borderBottom: "1px solid var(--color-slate-100)",
  },
  title: {
    fontSize: "var(--font-size-lg)",
    fontWeight: "700",
    color: "var(--color-slate-900)",
  },
  subtitle: {
    fontSize: "var(--font-size-sm)",
    color: "var(--color-slate-500)",
    marginTop: "3px",
  },
  badge: {
    background: "rgba(29,78,216,0.08)",
    color: "var(--color-royal)",
    fontSize: "var(--font-size-xs)",
    fontWeight: "700",
    padding: "4px 12px",
    borderRadius: "999px",
    letterSpacing: "0.03em",
  },
  tableWrap: {
    overflowX: "auto",
  },
  indexTh: {
    width: "48px",
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: "10px",
  },
  indexTd: {
    textAlign: "center",
    color: "var(--color-slate-400)",
    fontSize: "var(--font-size-xs)",
    fontWeight: "600",
    background: "var(--color-slate-50)",
    borderRight: "1px solid var(--color-slate-100)",
  },
  nullBadge: {
    display: "inline-block",
    padding: "1px 7px",
    background: "var(--color-warning-bg)",
    color: "var(--color-warning)",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.04em",
  },
};

export default DataPreview;
