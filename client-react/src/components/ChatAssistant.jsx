import { useState } from "react";

function ChatAssistant({ dataset, columnNames }) {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askQuestion = () => {

    const q = question.toLowerCase();

    if (q.includes("rows") || q.includes("records")) {
      setAnswer(
        `Dataset contains ${dataset.length} records.`
      );
    }

    else if (q.includes("columns")) {
      setAnswer(
        `Dataset contains ${columnNames.length} columns.`
      );
    }

    else if (q.includes("column names")) {
      setAnswer(columnNames.join(", "));
    }

    else if (q.includes("female")) {

      const count = dataset.filter(
        (row) => row.GenderCode === "Female"
      ).length;

      setAnswer(
        `There are ${count} female employees.`
      );
    }

    else if (q.includes("male")) {

      const count = dataset.filter(
        (row) => row.GenderCode === "Male"
      ).length;

      setAnswer(
        `There are ${count} male employees.`
      );
    }

    else {
      setAnswer(
        "I don't understand that question yet."
      );
    }
  };

  return (
    <div
      style={{
        marginTop: "20px",
      }}
    >

      <h2
        style={{
          color: "#7C3AED",
          marginBottom: "20px",
        }}
      >
        🤖 Dataset AI Assistant
      </h2>

      <div
        style={{
          background:
            "linear-gradient(135deg,#ffffff,#f8f5ff)",
          padding: "25px",
          borderRadius: "20px",
          boxShadow:
            "0 8px 25px rgba(108,99,255,0.12)",
        }}
      >

        <input
          type="text"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          placeholder="Ask about your dataset..."
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            fontSize: "15px",
            marginBottom: "15px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={askQuestion}
          style={{
            background:
              "linear-gradient(135deg,#7C3AED,#DB2777)",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          🚀 Ask AI
        </button>

        {answer && (
          <div
            style={{
              marginTop: "20px",
              background: "#FDF2F8",
              padding: "20px",
              borderRadius: "15px",
              borderLeft:
                "5px solid #DB2777",
            }}
          >
            <strong>
              🤖 AI Response
            </strong>

            <p
              style={{
                marginTop: "10px",
              }}
            >
              {answer}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default ChatAssistant;