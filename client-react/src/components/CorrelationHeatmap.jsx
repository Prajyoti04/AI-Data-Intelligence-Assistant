function CorrelationHeatmap({ correlationMatrix }) {

  if (
    !correlationMatrix ||
    Object.keys(correlationMatrix).length === 0
  ) {
    return null;
  }

  const columns = Object.keys(
    correlationMatrix
  );

  const getColor = (value) => {

  if (value > 0.7)
    return "#7C3AED";

  if (value > 0.4)
    return "#C084FC";

  if (value > 0)
    return "#F3E8FF";

  if (value < -0.7)
    return "#DB2777";

  if (value < -0.4)
    return "#FDA4AF";

  return "#FFFFFF";
};

  return (
    <div>

      <h2
        style={{
          color: "#6C63FF",
          marginBottom: "20px",
        }}
      >
        🔥 Correlation Analysis
      </h2>

      <div
        style={{
          background:
            "white",
          padding: "25px",
          borderRadius: "20px",
          boxShadow:
            "0 8px 25px rgba(108,99,255,0.12)",
          overflowX: "auto",
        }}
      >

        <table
          style={{
            borderCollapse: "collapse",
            minWidth: "600px",
            width: "100%",
          }}
        >

          <thead>
            <tr>
              <th
                style={{
                  padding: "12px",
                  background: "#7C3AED",
                  color: "white",
                  fontWeight: "600",
                }}
              >
              </th>

              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "12px",
                    background:
                      "#6C63FF",
                    color: "white",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            {columns.map((rowCol) => (

              <tr key={rowCol}>

                <td
                  style={{
                    padding: "12px",
                    fontWeight: "600",
                    background: "#F8FAFC",
                  }}
                >
                  {rowCol}
                </td>

                {columns.map((col) => {

                  const value =
                    correlationMatrix[
                      rowCol
                    ][col];

                  return (
                    <td
                      key={col}
                      style={{
                        padding: "12px",
                        textAlign:
                          "center",
                        background:
                          getColor(
                            value
                          ),
                        color:
                        Math.abs(value) > 0.5
                        ? "white"
                        : "#1E293B"
                      }}
                    >
                      {value}
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

export default CorrelationHeatmap;