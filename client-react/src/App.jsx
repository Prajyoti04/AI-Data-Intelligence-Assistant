import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Visualizations from "./pages/Visualizations";
import Navbar from "./components/Navbar";
import Reports from "./pages/Reports";
import Predictions from "./pages/Predictions";
import DataCleaning from "./pages/DataCleaning";

function App() {

  const [page, setPage] = useState("dashboard");

  const [dataset, setDataset] = useState([]);

  const [columnNames, setColumnNames] = useState([]);
  const [correlationMatrix, setCorrelationMatrix] = useState({});
  const [numericColumns,setNumericColumns] =useState([]);
  const [recommendation,setRecommendation] = useState(null);

  return (
    <>
      <Navbar
        page={page}
        setPage={setPage}
      />

      {page === "dashboard" && (
        <Dashboard
          setDataset={setDataset}
          setColumnNames={setColumnNames}
          setCorrelationMatrix={setCorrelationMatrix}
          setNumericColumns={setNumericColumns}
          setRecommendation={setRecommendation}
        />
      )}

      {page === "visualizations" && (
        <Visualizations
          dataset={dataset}
          columnNames={columnNames}
          correlationMatrix={correlationMatrix}
          recommendation={recommendation}
        />
      )}
      {page === "reports" && (
        <Reports />
      )}
      {page === "predictions" && (
        <Predictions numericColumns={numericColumns}/>
      )}
      {page === "cleaning" && (
        <DataCleaning dataset={dataset}/>
      )}
    </>
  );
}

export default App;