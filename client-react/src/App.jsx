import { useState } from "react";
import Navbar       from "./components/Navbar";
import Dashboard    from "./pages/Dashboard";
import Visualizations from "./pages/Visualizations";
import Predictions  from "./pages/Predictions";
import DataCleaning from "./pages/DataCleaning";
import Reports      from "./pages/Reports";

/**
 * App.jsx — now completely stateless for data.
 * All upload/dataset state lives in DataContext (provided in main.jsx).
 * App only manages the active page for navigation.
 */
function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="app-layout">
      <Navbar page={page} setPage={setPage} />

      <main className="main-content">
        {page === "dashboard"      && <Dashboard />}
        {page === "visualizations" && <Visualizations />}
        {page === "predictions"    && <Predictions />}
        {page === "cleaning"       && <DataCleaning />}
        {page === "reports"        && <Reports />}
      </main>
    </div>
  );
}

export default App;
