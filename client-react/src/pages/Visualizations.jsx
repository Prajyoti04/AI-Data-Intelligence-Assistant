import { useState } from "react";
import PieChartView from "../components/PieChartView";
import BarChartView from "../components/BarChartView";
import AIInsights from "../components/AIInsights";
import CorrelationHeatmap from "../components/CorrelationHeatmap";
import ChatAssistant from "../components/ChatAssistant";
import ScatterPlotView from "../components/ScatterPlotView";
function Visualizations({ dataset, columnNames,correlationMatrix,recommendation }) {

  const [selectedColumn, setSelectedColumn] = useState("");

        useEffect(() => {
          if (columnNames.length > 0) {
            setSelectedColumn(columnNames[0]);
          }
        }, [columnNames]);

  if (!dataset || dataset.length === 0) {
    return (
      <div
        style={{
          padding: "30px",
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#f8f5ff,#eef2ff)",
        }}
      >
        <h1>Visualizations</h1>
        <p>Please upload a dataset first.</p>
      </div>
    );
  }

  const counts = {};

  dataset.forEach((row) => {
    const value = row[selectedColumn] || "Unknown";

    counts[value] = (counts[value] || 0) + 1;
  });

  const chartData = Object.keys(counts).map((key) => ({
  name: key,
  value: counts[key],
}));

const barData = [...chartData]
  .sort((a, b) => b.value - a.value)
  .slice(0, 10);

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
          "linear-gradient(135deg,#6c63ff,#8b5cf6)",
        color: "white",
        padding: "25px",
        borderRadius: "20px",
        marginBottom: "25px",
      }}
    >
      <h1>📊 Visualizations Dashboard</h1>
      <p>Interactive Analytics & Insights</p>
    </div>

    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        marginBottom: "25px",
        boxShadow:
          "0 6px 18px rgba(108,99,255,0.12)",
      }}
    >
      <label
        style={{
          fontWeight: "bold",
          marginRight: "10px",
        }}
      >
        Select Column:
      </label>

      <select
        value={selectedColumn}
        onChange={(e) =>
          setSelectedColumn(e.target.value)
        }
        style={{
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #ddd",
        }}
      >
        {columnNames.map((col) => (
          <option key={col} value={col}>
            {col}
          </option>
        ))}
      </select>
    </div>

    <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    marginBottom: "25px",
  }}
>

  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "18px",
      boxShadow:
        "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    <h2
      style={{
        color: "#4F46E5",
      }}
    >
      📊 Distribution Analysis
    </h2>

    <PieChartView data={chartData} />
  </div>

  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "18px",
      boxShadow:
        "0 4px 12px rgba(0,0,0,0.08)",
    }}
  >
    <h2
      style={{
        color: "#0EA5E9",
      }}
    >
      📈 Top Categories
    </h2>

    <BarChartView data={barData} />
  </div>

</div>

    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "20px",
        marginBottom: "25px",
        boxShadow:
          "0 8px 25px rgba(108,99,255,0.12)",
      }}
    >
      <AIInsights dataset={dataset} correlationMatrix={correlationMatrix} recommendation={recommendation}
      />
    </div>

    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "20px",
        marginBottom: "25px",
        boxShadow:
          "0 8px 25px rgba(108,99,255,0.12)",
      }}
    >
      <CorrelationHeatmap correlationMatrix={correlationMatrix} />
    </div>

    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "20px",
        boxShadow:
          "0 8px 25px rgba(108,99,255,0.12)",
      }}
    >
      <ChatAssistant
        dataset={dataset}
        columnNames={columnNames}
        recommendation={recommendation}
        correlationMatrix={correlationMatrix}
      />
    </div>
  </div>
);
{xColumn && yColumn && (

  <div
    style={{
      background:
        "linear-gradient(135deg,#7C3AED,#DB2777)",
      padding: "25px",
      borderRadius: "20px",
      boxShadow:
        "0 8px 25px rgba(108,99,255,0.12)",
      marginBottom: "25px",
    }}
  >

    <h2
      style={{
        color: "#EC4899",
      }}
    >
      📍 Scatter Plot
    </h2>

    <ScatterPlotView
      data={dataset}
      xColumn={xColumn}
      yColumn={yColumn}
    />

  </div>

)}
}

export default Visualizations;