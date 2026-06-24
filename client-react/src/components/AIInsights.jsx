function AIInsights({
  dataset,
  correlationMatrix,
  recommendation,
}) {

  if (!dataset || dataset.length === 0) {
    return null;
  }

  const totalRows = dataset.length;

  const totalColumns =
    Object.keys(dataset[0]).length;

  const missingValues = dataset.reduce(
    (count, row) =>
      count +
      Object.values(row).filter(
        (value) =>
          value === null ||
          value === undefined ||
          value === ""
      ).length,
    0
  );

  const qualityScore =
    Math.max(
      0,
      100 -
        Math.round(
          (missingValues /
            (totalRows * totalColumns)) *
            100
        )
    );

  let datasetRecommendation =
    "Further analysis recommended";

  if (totalRows > 100) {
    datasetRecommendation =
      "Dataset size is sufficient for Machine Learning";
  }

  let strongestPair = "N/A";
  let strongestValue = 0;

  if (
    correlationMatrix &&
    Object.keys(correlationMatrix).length > 0
  ) {

    Object.keys(correlationMatrix).forEach(
      (row) => {

        Object.keys(
          correlationMatrix[row]
        ).forEach((col) => {

          const value =
            Math.abs(
              correlationMatrix[row][col]
            );

          if (
            row !== col &&
            value > strongestValue
          ) {

            strongestValue = value;

            strongestPair =
              `${row} ↔ ${col}`;

          }

        });

      }
    );

  }

  const cardStyle = {
    background:
      "linear-gradient(135deg,#ffffff,#fdf4ff)",
    padding: "20px",
    borderRadius: "18px",
    boxShadow:
      "0 8px 20px rgba(124,58,237,0.08)",
    minWidth: "220px",
    flex: "1",
  };

  return (
    <div>

      <h2
        style={{
          color: "#7C3AED",
          marginBottom: "20px",
        }}
      >
        🧠 AI Dataset Insights
      </h2>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >

        <div style={cardStyle}>
          <h3>📊 Records</h3>
          <h1 style={{ color: "#7C3AED" }}>
            {totalRows}
          </h1>
        </div>

        <div style={cardStyle}>
          <h3>📋 Columns</h3>
          <h1 style={{ color: "#DB2777" }}>
            {totalColumns}
          </h1>
        </div>

        <div style={cardStyle}>
          <h3>⚠️ Missing Values</h3>
          <h1 style={{ color: "#F97316" }}>
            {missingValues}
          </h1>
        </div>

        <div style={cardStyle}>
          <h3>✅ Data Quality</h3>
          <h1 style={{ color: "#10B981" }}>
            {qualityScore}%
          </h1>
        </div>

        <div style={cardStyle}>
          <h3>🔥 Strongest Relation</h3>

          <p
            style={{
              fontWeight: "700",
              color: "#7C3AED",
            }}
          >
            {strongestPair}
          </p>

          <p>
            Correlation:
            {" "}
            {strongestValue.toFixed(2)}
          </p>
        </div>

      </div>

      <div
        style={{
          marginTop: "25px",
          background:
            "linear-gradient(135deg,#7C3AED,#DB2777)",
          color: "white",
          padding: "25px",
          borderRadius: "18px",
        }}
      >

        <h3>
          🤖 AI Summary
        </h3>

        <p>
          Dataset contains
          <b> {totalRows}</b>
          {" "}records and
          <b> {totalColumns}</b>
          {" "}columns.
        </p>

        <p>
          Missing values detected:
          <b> {missingValues}</b>
        </p>

        <p>
          Quality Score:
          <b> {qualityScore}%</b>
        </p>

        <p>
          Recommendation:
          <b>
            {" "}
            {datasetRecommendation}
          </b>
        </p>

        <p>
          Strongest Correlation:
          <b>
            {" "}
            {strongestPair}
          </b>
          {" "}
          ({strongestValue.toFixed(2)})
        </p>

        {recommendation && (

          <>

            <p>
              Recommended Task:
              <b>
                {" "}
                {recommendation.task}
              </b>
            </p>

            <p>
              Suggested Algorithms:
            </p>

            <ul>
              {recommendation.algorithms.map(
                (algo) => (
                  <li key={algo}>
                    {algo}
                  </li>
                )
              )}
            </ul>

          </>

        )}

      </div>

    </div>
  );
}

export default AIInsights;