function Navbar({ page, setPage }) {

  const navButton = (name, label) => ({
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.3s",
    background:
      page === name
        ? "#ffffff"
        : "rgba(255,255,255,0.2)",
    color:
      page === name
        ? "#6c63ff"
        : "white",
  });

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        padding: "25px 30px",
        background:
          "linear-gradient(135deg,#7C3AED,#DB2777)",
        alignItems: "center",
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          color: "white",
          margin: 0,
          marginRight: "20px",
        }}
      >
        AI Data Intelligence
      </h2>

      <button
        onClick={() => setPage("dashboard")}
        style={navButton("dashboard")}
      >
        Dashboard
      </button>

      <button
        onClick={() => setPage("visualizations")}
        style={navButton("visualizations")}
      >
        Visualizations
      </button>

      <button
        onClick={() => setPage("reports")}
        style={navButton("reports")}
      >
        Reports
      </button>

      <button
        onClick={() => setPage("predictions")}
        style={navButton("predictions")}
      >
        Predictions
      </button>
      <button
        onClick={() => setPage("cleaning")}
        style={navButton("cleaning")}
      >
        Data Cleaning
      </button>
    </div>
  );
}

export default Navbar;