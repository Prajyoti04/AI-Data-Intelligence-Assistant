function CorrelationHeatmap({ correlationMatrix }) {
  if (!correlationMatrix || Object.keys(correlationMatrix).length === 0) return null;

  const columns = Object.keys(correlationMatrix);

  const getColor = (value) => {
    const v = parseFloat(value);
    if (isNaN(v)) return "#F1F5F9";
    if (v >= 0.8)  return "#1D4ED8";
    if (v >= 0.6)  return "#2563EB";
    if (v >= 0.4)  return "#3B82F6";
    if (v >= 0.2)  return "#93C5FD";
    if (v >= 0.0)  return "#DBEAFE";
    if (v >= -0.2) return "#FEE2E2";
    if (v >= -0.4) return "#FCA5A5";
    if (v >= -0.6) return "#F87171";
    if (v >= -0.8) return "#EF4444";
    return "#DC2626";
  };

  const getTextColor = (value) => {
    const v = Math.abs(parseFloat(value));
    return v >= 0.4 ? "white" : "var(--color-slate-700)";
  };

  return (
    <div>
      <div style={styles.titleRow}>
        <div>
          <div style={styles.title}>Correlation Matrix</div>
          <div style={styles.subtitle}>Pearson correlation between numeric columns</div>
        </div>
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendSwatch, background: "#1D4ED8" }} />
            <span>Strong +</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendSwatch, background: "#DBEAFE" }} />
            <span>Weak +</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{ ...styles.legendSwatch, background: "#EF4444" }} />
            <span>Negative</span>
          </div>
        </div>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.cornerTh} />
              {columns.map((col) => (
                <th key={col} style={styles.colTh}>
                  <span style={styles.colLabel}>{col}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {columns.map((rowCol) => (
              <tr key={rowCol}>
                <td style={styles.rowTh}>{rowCol}</td>
                {columns.map((col) => {
                  const raw = correlationMatrix[rowCol]?.[col];
                  const value = typeof raw === "number" ? raw : parseFloat(raw);
                  const isDiag = rowCol === col;
                  return (
                    <td
                      key={col}
                      title={`${rowCol} × ${col}: ${isNaN(value) ? "N/A" : value.toFixed(3)}`}
                      style={{
                        ...styles.cell,
                        background: isDiag ? "var(--color-navy)" : getColor(value),
                        color: isDiag ? "white" : getTextColor(value),
                        fontWeight: isDiag ? "800" : "600",
                      }}
                    >
                      {isDiag ? "1.00" : isNaN(value) ? "—" : value.toFixed(2)}
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
  titleRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "18px",
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
  legend: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "var(--font-size-xs)",
    color: "var(--color-slate-500)",
    fontWeight: "600",
  },
  legendSwatch: {
    width: "12px",
    height: "12px",
    borderRadius: "3px",
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: "var(--border-radius-md)",
    border: "1px solid var(--color-slate-200)",
  },
  table: {
    borderCollapse: "collapse",
    width: "100%",
    minWidth: "400px",
  },
  cornerTh: {
    background: "var(--color-navy)",
    width: "120px",
    minWidth: "100px",
    padding: "10px",
  },
  colTh: {
    background: "var(--color-navy-light)",
    padding: "10px 6px",
    maxWidth: "80px",
    overflow: "hidden",
  },
  colLabel: {
    display: "block",
    color: "rgba(255,255,255,0.85)",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "75px",
    textAlign: "center",
  },
  rowTh: {
    background: "var(--color-slate-50)",
    padding: "10px 14px",
    fontSize: "var(--font-size-xs)",
    fontWeight: "700",
    color: "var(--color-slate-700)",
    borderRight: "1px solid var(--color-slate-200)",
    whiteSpace: "nowrap",
    letterSpacing: "0.02em",
  },
  cell: {
    padding: "10px 8px",
    textAlign: "center",
    fontSize: "12px",
    transition: "opacity 0.15s ease",
    minWidth: "60px",
    letterSpacing: "0.01em",
    cursor: "default",
  },
};

export default CorrelationHeatmap;
