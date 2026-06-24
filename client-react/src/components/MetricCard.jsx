function MetricCard({ title, value }) {
  return (
    <div
      style={{
      background: "white",
      padding: "24px",
      borderRadius: "18px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      minWidth: "200px",
      flex: "1",
      borderLeft: "5px solid #6c63ff",

      cursor: "pointer",
      transition: "all 0.3s ease",
    }}
    >
      <h4
        style={{
          margin: 0,
          color: "#666",
          fontWeight: "500",
        }}
      >
        {title}
      </h4>

      <h1
        style={{
          marginTop: "12px",
          marginBottom: 0,
          color: "#6c63ff",
          fontSize: "2rem",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default MetricCard;