import { useState } from "react";
import MetricCard from "../components/MetricCard";
import UploadBox from "../components/UploadBox";

import DataPreview from "../components/DataPreview";

function Dashboard({
      setDataset,
      setColumnNames,
      setCorrelationMatrix,
      setNumericColumns,
      setRecommendation
    }) {

  const [stats, setStats] = useState({
    rows: 0,
    columns: 0,
    missing_values: 0,
    duplicates: 0,
  });
  
  const [preview, setPreview] = useState([]);

  return (
  <div
    style={{
      padding: "30px",
      background: "#f7f9fc",
      minHeight: "100vh",
    }}
  >

    <div
      style={{
        background:
          "linear-gradient(135deg,#7C3AED,#DB2777)",
        color: "white",
        padding: "25px",
        borderRadius: "20px",
        marginBottom: "20px",
      }}
    >
      <h1>AI Data Intelligence Platform</h1>
      <p>Analytics • Insights • Predictions</p>
    </div>

    <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
      <MetricCard title="Rows" value={stats.rows} />
      <MetricCard title="Columns" value={stats.columns} />
      <MetricCard title="Missing Values" value={stats.missing_values} />
      <MetricCard title="Duplicates" value={stats.duplicates} />
    </div>

    <UploadBox
      setStats={setStats}
      setPreview={setPreview}
      setColumnNames={setColumnNames}
      setDataset={setDataset}
      setCorrelationMatrix={setCorrelationMatrix}
      setNumericColumns={setNumericColumns}
      setRecommendation={setRecommendation}
    />

        <DataPreview data={preview} />

  </div>
  );
}

export default Dashboard;