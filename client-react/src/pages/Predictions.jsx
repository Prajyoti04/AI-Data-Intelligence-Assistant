import { useState } from "react";

function Predictions({ numericColumns = [] }) {

  const [target, setTarget] = useState("");
  const [inputs, setInputs] = useState({});
  const [prediction, setPrediction] = useState(null);

  const predictValue = async () => {

    if (!target) {
      alert("Please select a target column");
      return;
    }

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target,
            inputs,
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      setPrediction(data.prediction);

    } catch (error) {

      console.log(error);
      alert("Prediction failed");

    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "30px",
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
        }}
      >
        <h1>🤖 AutoML Prediction Studio</h1>

        <p>
          Train and predict using any uploaded dataset
        </p>
      </div>

      <div
        style={{
          maxWidth: "700px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >

        <h3>Select Target Column</h3>

        <select
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
            setPrediction(null);
          }}
          style={inputStyle}
        >
          <option value="">
            Select Target
          </option>

          {numericColumns.map((col) => (
            <option
              key={col}
              value={col}
            >
              {col}
            </option>
          ))}
        </select>

        {target && (
          <div
            style={{
              background: "#F8FAFC",
              padding: "15px",
              borderRadius: "12px",
              marginBottom: "20px",
              border: "1px solid #E2E8F0",
            }}
          >
            <h4>📋 Prediction Information</h4>

            <p>
              <b>Target Variable:</b> {target}
            </p>

            <p>
              <b>Features Used:</b>{" "}
              {numericColumns
                .filter((col) => col !== target)
                .join(", ")}
            </p>
          </div>
        )}

        {target &&
          numericColumns
            .filter((col) => col !== target)
            .map((col) => (
              <input
                key={col}
                type="number"
                placeholder={col}
                style={inputStyle}
                onChange={(e) =>
                  setInputs({
                    ...inputs,
                    [col]: Number(e.target.value),
                  })
                }
              />
            ))}

        <button
          onClick={predictValue}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "12px",
            background: "#6C63FF",
            color: "white",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          🚀 Predict
        </button>

        {prediction !== null && (

          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#EEF2FF",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >

            <h3>
              🎯 Predicted {target}
            </h3>

            <h1
              style={{
                color: "#6C63FF",
                marginBottom: "10px",
              }}
            >
              {prediction}
            </h1>

            <p
              style={{
                color: "#666",
                lineHeight: "1.6",
              }}
            >
              Based on the entered feature values,
              the predicted <b>{target}</b> is
              <b> {prediction}</b>.
            </p>

            <div
              style={{
                marginTop: "15px",
                padding: "12px",
                background: "#FFF7ED",
                borderRadius: "10px",
                color: "#9A3412",
              }}
            >
              ⚠️ Prediction quality depends on
              the selected target variable and
              available dataset features.
            </div>

          </div>

        )}

      </div>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "14px",
  boxSizing: "border-box",
};

export default Predictions;