import API from "../services/api";
function UploadBox({ setStats, setPreview,setColumnNames,setDataset,setCorrelationMatrix,setNumericColumns,setRecommendation}) {

  const handleFileUpload = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await fetch(`${API}/upload`, {
        method: "POST",
        body: formData,
      });

      console.log("Status:", response.status);

      const data = await response.json();
      console.log(data);
      console.log(Object.keys(data));
      console.log(data.dataset?.length);

      console.log("Response:", data);

      setStats(data);
      setPreview(data.preview);
      setColumnNames(data.column_names);
      setDataset(data.dataset);
      setCorrelationMatrix(data.correlation_matrix);
      setRecommendation(data.recommended_task);
      setNumericColumns(data.numeric_columns);

      alert("Upload successful!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
  <div
  style={{
    background:
      "linear-gradient(135deg,#7C3AED,#DB2777)",
    border: "3px dashed rgba(255,255,255,0.3)",

    maxWidth: "750px",
    margin: "30px auto",

    padding: "60px",
    borderRadius: "25px",
    textAlign: "center",

    boxShadow:
      "0 20px 50px rgba(124,58,237,0.25)",
  }}
>
    <div
      style={{
        fontSize: "80px",
        marginBottom: "15px",
      }}
    >
      🚀
    </div>

    <h2
      style={{
        color: "white",
        fontSize: "1rem",
        fontWeight: "400",
        marginBottom: "10px",
        lineHeight: "1.7",
      }}
    >
      Upload Dataset
    </h2>

    <p
      style={{
        color: "#ebeff5",
        fontSize: "1.5rem",
        fontWeight: "500",
        marginBottom: "30px",
      }}
    >
      Upload CSV or Excel files to generate
      insights, visualizations and machine
      learning predictions.
    </p>

    <label
      style={{
        background:
          "white",
        color: "#7C3AED",
        padding: "14px 30px",
        borderRadius: "12px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "15px",
        boxShadow:"0 8px 20px rgba(0,0,0,0.15)",
      }}
    >
      📤 Choose Dataset

      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={handleFileUpload}
        hidden
      />
    </label>
  </div>
);
}

export default UploadBox;