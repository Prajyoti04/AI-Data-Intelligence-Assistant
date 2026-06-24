function DataPreview({ data }) {

  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);

  return (
    <div
      style={{
        marginTop: "40px",
        background: "white",
        padding: "25px",
        borderRadius: "20px",
        boxShadow:
          "0 8px 25px rgba(108,99,255,0.12)",
      }}
    >

      <h2
        style={{
          color: "#6C63FF",
          marginBottom: "20px",
        }}
      >
        📋 Dataset Preview
      </h2>

      <div
        style={{
          overflowX: "auto",
          borderRadius: "15px",
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "800px",
          }}
        >

          <thead>
            <tr
              style={{
                background:
                  "linear-gradient(135deg,#6C63FF,#8B5CF6)",
                color: "white",
              }}
            >
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "14px",
                    textAlign: "left",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                style={{
                  background:
                    index % 2 === 0
                      ? "#faf9ff"
                      : "white",
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    style={{
                      padding: "12px",
                      borderBottom:
                        "1px solid #eee",
                    }}
                  >
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default DataPreview;