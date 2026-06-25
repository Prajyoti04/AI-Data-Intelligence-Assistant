import { useState } from "react";
import API from "../services/api";

function DataCleaning({ dataset = [] }) {

  const [result, setResult] = useState(null);

  const cleanDataset = async () => {

    try {

      const response = await fetch(`${API}/clean`, 
        {
          method: "POST",
        }
      );

      const data = await response.json();

      console.log(
        "Cleaning Response:",
        data
      );

      if (data.error) {
        alert(data.error);
        return;
      }

      setResult(data);

    } catch (error) {

      console.log(error);

      alert(
        "Cleaning operation failed"
      );

    }
  };

  const downloadCleaned = () => {

     window.open(`${API}/download-cleaned`, "_blank");

  };

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f8f5ff,#eef2ff)",
      }}
    >

      <div
        style={{
          background:
            "linear-gradient(135deg,#7C3AED,#DB2777)",
          color: "white",
          padding: "25px",
          borderRadius: "20px",
          marginBottom: "25px",
          textAlign: "center",
        }}
      >
        <h1>🧹 Data Cleaning Studio</h1>

        <p>
          Clean missing values and duplicates
          before analytics & ML
        </p>
      </div>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow:
            "0 8px 25px rgba(124,58,237,0.12)",
        }}
      >

        <p>
          Dataset Records:
          <b> {dataset.length}</b>
        </p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "20px",
          }}
        >

          <button
            onClick={cleanDataset}
            style={{
              background:
                "linear-gradient(135deg,#7C3AED,#DB2777)",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            🧹 Clean Dataset
          </button>

          <button
            onClick={downloadCleaned}
            style={{
              background: "#10B981",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            ⬇ Download Cleaned CSV
          </button>

        </div>

        {result && (

          <div
            style={{
              marginTop: "25px",
              background: "#EEF2FF",
              padding: "20px",
              borderRadius: "15px",
            }}
          >

            <h3>
              ✅ Cleaning Summary
            </h3>

            <p>
              Rows Before:
              <b> {result.rows_before}</b>
            </p>

            <p>
              Rows After:
              <b> {result.rows_after}</b>
            </p>

            <p>
              Duplicates Removed:
              <b>
                {" "}
                {result.duplicates_removed}
              </b>
            </p>

            <p>
              Missing Values Remaining:
              <b>
                {" "}
                {result.missing_after}
              </b>
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default DataCleaning;