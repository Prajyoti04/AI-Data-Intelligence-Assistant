import { useEffect, useState } from "react";

function Reports() {

  const [report, setReport] = useState(null);

  useEffect(() => {

    fetch("https://ai-data-intelligence-assistant.onrender.com/report")
      .then((res) => res.json())
      .then((data) => setReport(data));

  }, []);

  if (!report) {
    return <h2>Loading report...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>EDA Report</h1>

      <p>Rows: {report.rows}</p>

      <p>Columns: {report.columns}</p>

      <p>
        Missing Values:
        {report.missing_values}
      </p>

      <p>
        Duplicates:
        {report.duplicates}
      </p>

      <h2>Numeric Columns</h2>

      <ul>
        {report.numeric_columns.map((col) => (
          <li key={col}>{col}</li>
        ))}
      </ul>
      <button
          onClick={() => {
            window.open(
              "https://ai-data-intelligence-assistant.onrender.com/download-report"
            );
          }}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          Download PDF Report
      </button>
    </div>
  );
}

export default Reports;